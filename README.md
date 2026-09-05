# 🚀 CPA Proxy for Copilot Chat

[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.116%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Release](https://img.shields.io/github/v/release/happyfox-dot/cpa-copilot-chat?color=blue&logo=github)](https://github.com/happyfox-dot/cpa-copilot-chat/releases)

Seamlessly connect your local **CPA (EasyCLIProxyAPI / CLI Proxy API)** or **multiple OpenAI/Anthropic-compatible upstream providers (DeepSeek, OpenRouter, One API, Claude direct proxies, etc.)** directly into **GitHub Copilot Chat** using VS Code's native `LanguageModelChatProvider` API.

---

## ✨ Features

- 🖥️ **Interactive UI for Adding Providers**: Add, list, and delete custom providers without touching JSON config files via `Ctrl+Shift+P`.
- 🔀 **OpenAI & Anthropic Dual-Protocol (`apiMode`)**:
  - `openai`: targets `/chat/completions` with `Bearer` token.
  - `anthropic`: targets `/v1/messages` with `x-api-key` and `anthropic-version`.
- 🏢 **Multi-Provider Support**: Add as many providers as you want. All models aggregate into Copilot Chat with clean prefixes.
- 🔄 **Dynamic Model Synchronization**: Automatically queries `/models` on startup.
- ⚡ **Full Streaming (SSE)**: Native token-by-token streaming with low latency.
- 🧠 **Thinking / Reasoning Support**: Natively emits `LanguageModelThinkingPart` for thinking models.
- 🖼️ **Multimodal / Vision Support**: Supports image attachments and `#file` references.
- 🤖 **Copilot Agent Mode Ready**: Full support for tool calling (terminal commands, file search, file editing).
- 🔒 **Zero Telemetry & 100% Local**: No external tracking or telemetry.

---

## 🚀 How to Add Providers via UI

1. Press `Ctrl + Shift + P` in VS Code.
2. Search and select **`CPA: Add Provider (UI / 交互式添加供应商)`**.
3. Follow the 4-step wizard:
   - Provider Name (e.g. `DeepSeek`, `AnyRouter`, `Claude`)
   - Protocol Mode (`OpenAI` or `Anthropic`)
   - Base URL (e.g. `https://api.deepseek.com/v1`)
   - API Key
4. Hit Enter, and your models will refresh in Copilot Chat immediately!

To manage or delete existing providers, run **`CPA: Manage Providers (UI / 管理及删除供应商)`**.

---

## ⚙️ Manual Configuration (`settings.json`)

```json
{
  "cpa-copilot.baseUrl": "http://127.0.0.1:8317/v1",
  "cpa-copilot.apiKey": "123456",

  "cpa-copilot.providers": [
    {
      "name": "DeepSeek",
      "baseUrl": "https://api.deepseek.com/v1",
      "apiKey": "sk-your-deepseek-api-key",
      "apiMode": "openai"
    },
    {
      "name": "Claude Proxy",
      "baseUrl": "https://your-claude-proxy.com/v1",
      "apiKey": "sk-ant-api03-xxx",
      "apiMode": "anthropic"
    }
  ]
}
```

---

## 📄 License

[MIT License](LICENSE) © 2026 happyfox-dot
