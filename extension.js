"use strict";

const vscode = require('vscode');

const output = vscode.window.createOutputChannel('CPA Copilot');

const FALLBACK_MODEL_IDS = [
  'claude-opus-4-6-thinking',
  'claude-sonnet-4-6',
  'gemini-3.8-flash-high',
  'gemini-3.7-flash-high',
  'gemini-pro-agent',
  'gemini-3.1-pro-low',
  'gemini-3.6-flash-high',
  'gemini-3-flash',
  'gemini-3.1-flash-image',
  'gpt-oss-120b-medium',
  'gemini-3.1-flash-lite'
];

function formatModelName(id, providerPrefix) {
  const customNames = {
    'claude-opus-4-6-thinking': 'Claude Opus 4.6 (Thinking)',
    'claude-sonnet-4-6': 'Claude Sonnet 4.6',
    'gemini-3.8-flash-high': 'Gemini 3.8 Flash High',
    'gemini-3.7-flash-high': 'Gemini 3.7 Flash High',
    'gemini-pro-agent': 'Gemini Pro Agent',
    'gemini-3.1-pro-low': 'Gemini 3.1 Pro Low',
    'gemini-3.6-flash-high': 'Gemini 3.6 Flash High',
    'gemini-3-flash': 'Gemini 3.0 Flash',
    'gemini-3.1-flash-image': 'Gemini 3.1 Flash Image',
    'gpt-oss-120b-medium': 'GPT-OSS 120B Medium',
    'gemini-3.1-flash-lite': 'Gemini 3.1 Flash Lite',
    'deepseek-chat': 'DeepSeek V3',
    'deepseek-reasoner': 'DeepSeek R1 (Thinking)'
  };

  const baseName = customNames[id] || id
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (providerPrefix && providerPrefix.toLowerCase() !== 'default' && providerPrefix.toLowerCase() !== 'cpa') {
    return `[${providerPrefix}] ${baseName}`;
  }
  return baseName;
}

function convertMessages(messages) {
  const result = [];
  for (const message of messages) {
    let role = 'user';
    if (message.role === vscode.LanguageModelChatMessageRole?.Assistant || message.role === 'assistant' || message.role === 2) {
      role = 'assistant';
    } else if (message.role === vscode.LanguageModelChatMessageRole?.User || message.role === 'user' || message.role === 1) {
      role = 'user';
    }

    let textContent = '';
    const imageParts = [];
    const toolCalls = [];
    const toolResults = [];

    for (const part of message.content) {
      if (part instanceof vscode.LanguageModelTextPart || (part && typeof part.value === 'string' && !part.mimeType && !part.callId)) {
        textContent += part.value;
      } else if (part instanceof vscode.LanguageModelDataPart && part.mimeType && part.mimeType.startsWith('image/')) {
        const base64 = Buffer.from(part.data).toString('base64');
        imageParts.push({
          type: 'image_url',
          image_url: { url: `data:${part.mimeType};base64,${base64}` }
        });
      } else if (part instanceof vscode.LanguageModelToolCallPart) {
        toolCalls.push({
          id: part.callId,
          type: 'function',
          function: {
            name: part.name,
            arguments: JSON.stringify(part.input || {})
          }
        });
      } else if (part instanceof vscode.LanguageModelToolResultPart) {
        let toolText = '';
        if (Array.isArray(part.content)) {
          for (const item of part.content) {
            if (item instanceof vscode.LanguageModelTextPart) {
              toolText += item.value;
            }
          }
        }
        toolResults.push({
          callId: part.callId,
          content: toolText || JSON.stringify(part.content || {})
        });
      }
    }

    if (role === 'assistant') {
      const msg = { role: 'assistant', content: textContent || '' };
      if (toolCalls.length > 0) {
        msg.tool_calls = toolCalls;
      }
      result.push(msg);
    } else {
      if (imageParts.length > 0) {
        result.push({
          role: 'user',
          content: [
            { type: 'text', text: textContent || '' },
            ...imageParts
          ]
        });
      } else if (textContent) {
        result.push({ role: 'user', content: textContent });
      }
      if (toolResults.length > 0) {
        for (const tr of toolResults) {
          result.push({
            role: 'tool',
            tool_call_id: tr.callId,
            content: tr.content
          });
        }
      }
    }
  }
  return result;
}

function convertTools(tools) {
  if (!tools || tools.length === 0) return undefined;
  return tools.map(t => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description || '',
      parameters: t.inputSchema || { type: 'object', properties: {} }
    }
  }));
}

function emitToolCall(tc, progress) {
  if (!tc || !tc.name) return;
  let args = {};
  try {
    args = JSON.parse(tc.arguments || '{}');
  } catch {
    args = {};
  }
  progress.report(new vscode.LanguageModelToolCallPart(tc.id, tc.name, args));
}

class CpaChatProvider {
  constructor() {
    this.onDidChangeLanguageModelChatInformationEmitter = new vscode.EventEmitter();
    this.onDidChangeLanguageModelChatInformation = this.onDidChangeLanguageModelChatInformationEmitter.event;
    // Map of model composite id -> provider endpoint details
    this.modelRoutingMap = new Map();
  }

  refresh() {
    this.onDidChangeLanguageModelChatInformationEmitter.fire();
  }

  async provideLanguageModelChatInformation(_options, _token) {
    const config = vscode.workspace.getConfiguration('cpa-copilot');
    const defaultBaseUrl = (config.get('baseUrl') || 'http://127.0.0.1:8317/v1').replace(/\/+$/, '');
    const defaultApiKey = config.get('apiKey') || '123456';
    const extraProviders = config.get('providers') || [];

    // Construct unified list of providers to query
    const providerList = [
      {
        name: 'CPA',
        prefix: '',
        baseUrl: defaultBaseUrl,
        apiKey: defaultApiKey,
        models: []
      }
    ];

    if (Array.isArray(extraProviders)) {
      for (const ep of extraProviders) {
        if (ep && ep.name && ep.baseUrl) {
          providerList.push({
            name: ep.name.trim(),
            prefix: ep.name.trim(),
            baseUrl: ep.baseUrl.trim().replace(/\/+$/, ''),
            apiKey: ep.apiKey ? ep.apiKey.trim() : defaultApiKey,
            models: Array.isArray(ep.models) ? ep.models : [],
            temperature: typeof ep.temperature === 'number' ? ep.temperature : undefined
          });
        }
      }
    }

    this.modelRoutingMap.clear();
    const resultModels = [];

    for (const p of providerList) {
      let modelIds = [];

      if (p.models && p.models.length > 0) {
        modelIds = p.models;
        output.appendLine(`[INFO] Provider [${p.name}] uses fixed list of ${modelIds.length} models`);
      } else {
        try {
          const res = await fetch(`${p.baseUrl}/models`, {
            headers: {
              'Authorization': `Bearer ${p.apiKey}`,
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(3000)
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.data) && data.data.length > 0) {
              modelIds = data.data.map(m => m.id);
              output.appendLine(`[INFO] Loaded ${modelIds.length} live models from [${p.name}] (${p.baseUrl}/models)`);
            }
          }
        } catch (err) {
          output.appendLine(`[WARN] Could not fetch models from [${p.name}] ${p.baseUrl}/models (${err.message}).`);
        }
      }

      // If default CPA provider failed and has no models, use fallbacks
      if (modelIds.length === 0 && p.name === 'CPA') {
        modelIds = FALLBACK_MODEL_IDS;
      }

      for (const rawId of modelIds) {
        // Unique model ID exposed to VS Code
        const compositeId = p.prefix ? `${p.prefix}__${rawId}` : rawId;

        this.modelRoutingMap.set(compositeId, {
          rawModelId: rawId,
          providerName: p.name,
          baseUrl: p.baseUrl,
          apiKey: p.apiKey,
          temperature: p.temperature
        });

        const isThinking = rawId.includes('thinking') || rawId.includes('r1') || rawId.includes('reasoning');
        const isGemini = rawId.includes('gemini');

        resultModels.push({
          id: compositeId,
          name: formatModelName(rawId, p.prefix),
          family: 'cpa',
          version: '1.0',
          detail: `${p.name}: ${rawId}`,
          maxInputTokens: isGemini ? 1000000 : 200000,
          maxOutputTokens: 16384,
          isUserSelectable: true,
          capabilities: {
            toolCalling: true,
            imageInput: true,
            thinking: isThinking
          }
        });
      }
    }

    return resultModels;
  }

  async provideTokenCount(_modelInfo, text, _token) {
    if (typeof text === 'string') {
      return Math.max(1, Math.ceil(text.length / 4));
    }
    if (!text) {
      return 1;
    }
    if (text.content && Array.isArray(text.content)) {
      let totalChars = 0;
      for (const part of text.content) {
        if (part && typeof part.value === 'string') {
          totalChars += part.value.length;
        } else if (part instanceof vscode.LanguageModelToolCallPart) {
          totalChars += JSON.stringify(part.input || {}).length + (part.name?.length || 0);
        } else {
          totalChars += 200;
        }
      }
      return Math.max(1, Math.ceil(totalChars / 4));
    }
    return Math.max(1, Math.ceil(String(text).length / 4));
  }

  async provideLanguageModelChatResponse(modelInfo, messages, options, progress, token) {
    const config = vscode.workspace.getConfiguration('cpa-copilot');
    const globalTemperature = config.get('temperature', 0.3);
    const maxTokens = config.get('maxTokens', 0);

    // Look up target provider route
    const route = this.modelRoutingMap.get(modelInfo.id) || {
      rawModelId: modelInfo.id,
      providerName: 'Default',
      baseUrl: (config.get('baseUrl') || 'http://127.0.0.1:8317/v1').replace(/\/+$/, ''),
      apiKey: config.get('apiKey') || '123456'
    };

    const temperature = typeof route.temperature === 'number' ? route.temperature : globalTemperature;
    const convertedMessages = convertMessages(messages);
    const convertedTools = convertTools(options?.tools);

    const reqBody = {
      model: route.rawModelId,
      messages: convertedMessages,
      stream: true,
      stream_options: { include_usage: true }
    };

    if (convertedTools && convertedTools.length > 0) {
      reqBody.tools = convertedTools;
    }
    if (typeof temperature === 'number') {
      reqBody.temperature = temperature;
    }
    if (maxTokens && maxTokens > 0) {
      reqBody.max_tokens = maxTokens;
    }

    const controller = new AbortController();
    token?.onCancellationRequested(() => controller.abort());

    output.appendLine(`[REQUEST] Streaming to [${route.providerName}] ${route.baseUrl}/chat/completions (model: ${route.rawModelId}, messages: ${convertedMessages.length})`);

    const res = await fetch(`${route.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${route.apiKey}`
      },
      body: JSON.stringify(reqBody),
      signal: controller.signal
    });

    if (!res.ok) {
      const errText = await res.text();
      output.appendLine(`[ERROR] API request failed with status ${res.status}: ${errText}`);
      throw new Error(`CPA Proxy API error (${res.status}): ${errText}`);
    }

    if (!res.body) {
      throw new Error('No response body received from server.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    const pendingToolCalls = new Map();

    while (true) {
      if (token?.isCancellationRequested) {
        controller.abort();
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;

        if (trimmed === 'data: [DONE]') {
          for (const tc of pendingToolCalls.values()) {
            emitToolCall(tc, progress);
          }
          pendingToolCalls.clear();
          return;
        }

        if (!trimmed.startsWith('data: ')) continue;
        const jsonStr = trimmed.slice(6);

        try {
          const chunk = JSON.parse(jsonStr);
          const choice = chunk.choices?.[0];
          if (!choice) continue;

          const delta = choice.delta;
          if (!delta) continue;

          // 1. Thinking / Reasoning content
          const reasoning = delta.reasoning_content || delta.reasoning;
          if (reasoning) {
            if (vscode.LanguageModelThinkingPart) {
              progress.report(new vscode.LanguageModelThinkingPart(reasoning));
            } else {
              progress.report(new vscode.LanguageModelTextPart(reasoning));
            }
          }

          // 2. Normal text content
          if (delta.content) {
            progress.report(new vscode.LanguageModelTextPart(delta.content));
          }

          // 3. Tool Calls streaming accumulation
          if (delta.tool_calls) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              let pending = pendingToolCalls.get(idx);
              if (!pending) {
                pending = {
                  id: tc.id || `call_${idx}_${Date.now()}`,
                  name: tc.function?.name || '',
                  arguments: tc.function?.arguments || ''
                };
                pendingToolCalls.set(idx, pending);
              } else {
                if (tc.id) pending.id = tc.id;
                if (tc.function?.name) pending.name += tc.function.name;
                if (tc.function?.arguments) pending.arguments += tc.function.arguments;
              }
            }
          }

          // 4. Finish reason
          if (choice.finish_reason === 'tool_calls' || choice.finish_reason === 'stop') {
            for (const tc of pendingToolCalls.values()) {
              emitToolCall(tc, progress);
            }
            pendingToolCalls.clear();
          }
        } catch {
          // Ignore malformed JSON in SSE chunk
        }
      }
    }

    for (const tc of pendingToolCalls.values()) {
      emitToolCall(tc, progress);
    }
    pendingToolCalls.clear();
  }
}

let providerInstance;

function activate(context) {
  output.appendLine('Activating CPA Proxy Copilot extension...');
  providerInstance = new CpaChatProvider();

  context.subscriptions.push(
    vscode.lm.registerLanguageModelChatProvider('cpa', providerInstance),
    vscode.commands.registerCommand('cpa-copilot.refreshModels', () => {
      providerInstance.refresh();
      vscode.window.showInformationMessage('CPA models refreshed in Copilot Chat.');
    }),
    vscode.commands.registerCommand('cpa-copilot.openSettings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'cpa-copilot');
    }),
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('cpa-copilot')) {
        providerInstance.refresh();
      }
    })
  );
  output.appendLine('CPA Proxy Copilot extension activated successfully!');
}

function deactivate() {
  output.appendLine('CPA Proxy Copilot extension deactivated.');
}

module.exports = {
  activate,
  deactivate
};
