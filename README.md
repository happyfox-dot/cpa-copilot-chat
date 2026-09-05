# 🚀 CPA Proxy for Copilot Chat

[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.116%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Release](https://img.shields.io/github/v/release/happyfox-dot/cpa-copilot-chat?color=blue&logo=github)](https://github.com/happyfox-dot/cpa-copilot-chat/releases)

Seamlessly connect your local **CPA (EasyCLIProxyAPI / CLI Proxy API)** or **multiple OpenAI-compatible upstream providers (DeepSeek, OpenRouter, One API, New API, SiliconFlow, etc.)** directly into **GitHub Copilot Chat** using VS Code's native `LanguageModelChatProvider` API.

Bring your own models (Claude 3.7 Sonnet, Claude Opus Thinking, Gemini 3.8 / 2.0 Flash, DeepSeek-R1, etc.) directly into VS Code Copilot Chat and Agent Mode!

---

## ✨ Features

- 🏢 **Multi-Provider Support**: Not just local CPA — add as many OpenAI-compatible providers as you want (e.g. DeepSeek official, OpenRouter, self-hosted One API). All models aggregate cleanly into the Copilot Chat picker.
- 🔄 **Dynamic Model Synchronization**: Automatically queries `/models` on startup or configuration change. Custom providers automatically get prefixed display names (e.g., `[DeepSeek] DeepSeek V3`).
- ⚡ **Full Streaming (SSE)**: Native token-by-token streaming with low latency.
- 🧠 **Thinking / Reasoning Support**: Natively emits `LanguageModelThinkingPart` for thinking models (e.g. `Claude Opus (Thinking)` or `DeepSeek-R1`), rendering collapsible thinking bubbles in Copilot Chat.
- 🖼️ **Multimodal / Vision Support**: Supports image attachments and file context (`#file`, image drag-and-drop) converted to standard base64 multimodal payloads.
- 🤖 **Copilot Agent Mode Ready**: Full support for tool calling / function calling (terminal commands, file search, file editing, and multi-turn autonomous agent loops).
- 🔒 **Zero Telemetry & 100% Local**: Communicates strictly with your configured endpoints. No telemetry, no third-party data tracking.

---

## ⚙️ Multi-Provider Configuration

In your VS Code `settings.json`:

```json
{
  // Default local CPA service
  "cpa-copilot.baseUrl": "http://127.0.0.1:8317/v1",
  "cpa-copilot.apiKey": "123456",

  // 🚀 Add additional providers
  "cpa-copilot.providers": [
    {
      "name": "DeepSeek",
      "baseUrl": "https://api.deepseek.com/v1",
      "apiKey": "sk-your-deepseek-api-key",
      "models": ["deepseek-chat", "deepseek-reasoner"] // Optional: fixed list or leave empty to auto-fetch
    },
    {
      "name": "OpenRouter",
      "baseUrl": "https://openrouter.ai/api/v1",
      "apiKey": "sk-or-v1-your-key"
    }
  ]
}
```

### Commands (`Ctrl + Shift + P`)
- `CPA: Refresh Models in Copilot Chat`: Re-query all providers and refresh model list.
- `CPA: Open Settings`: Jump directly to CPA Copilot extension settings.

---

## 🚀 Quick Start

1. Download the latest `.vsix` file from [Releases](https://github.com/happyfox-dot/cpa-copilot-chat/releases).
2. In VS Code: Extensions panel -> `...` -> **Install from VSIX...** -> select `.vsix`.
3. Reload or restart VS Code.
4. Open Copilot Chat (`Ctrl + Alt + I`), choose any model under **CPA Proxy**, and start coding!

---

## 📄 License

[MIT License](LICENSE) © 2026 happyfox-dot
