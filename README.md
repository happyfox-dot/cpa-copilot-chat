# 🚀 CPA Proxy for Copilot Chat

[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.116%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)

Seamlessly connect your local **CPA (EasyCLIProxyAPI / CLI Proxy API)** reverse proxy service into **GitHub Copilot Chat** using VS Code's native `LanguageModelChatProvider` API.

Bring your own models (Claude 3.7 Sonnet, Claude Opus Thinking, Gemini 3.8 / 2.0 Flash, DeepSeek-R1, etc.) directly into VS Code Copilot Chat and Agent Mode!

---

## ✨ Features

- 🔄 **Dynamic Model Synchronization**: Automatically queries `http://127.0.0.1:8317/v1/models` on startup or refresh. Whatever models your CPA instance supports will immediately appear in the Copilot Chat model picker with clean, formatted display names.
- ⚡ **Full Streaming (SSE)**: Native token-by-token streaming with low latency.
- 🧠 **Thinking / Reasoning Support**: Natively emits `LanguageModelThinkingPart` for thinking models (e.g. `Claude Opus (Thinking)` or reasoning models), rendering collapsible thinking bubbles in Copilot Chat.
- 🖼️ **Multimodal / Vision Support**: Supports image attachments and file context (`#file`, image drag-and-drop) converted to standard base64 multimodal payloads.
- 🤖 **Copilot Agent Mode Ready**: Full support for tool calling / function calling (terminal commands, file search, file editing, and multi-turn autonomous agent loops).
- 🔒 **Zero Telemetry & 100% Local**: Only communicates with your configured local CPA endpoint (`127.0.0.1:8317`). No data leaves your machine.

---

## 📦 Supported Models (Examples)

When your CPA service is running, models are automatically discovered and displayed:

| Model ID | Display Name in Copilot Chat | Features |
| :--- | :--- | :--- |
| `claude-opus-4-6-thinking` | **Claude Opus 4.6 (Thinking)** | Deep Reasoning, Tool Calling, Vision |
| `claude-sonnet-4-6` | **Claude Sonnet 4.6** | SOTA Coding Agent, Fast, Tool Calling |
| `gemini-3.8-flash-high` | **Gemini 3.8 Flash High** | Multimodal, Long Context, Tool Calling |
| `gemini-3.7-flash-high` | **Gemini 3.7 Flash High** | High Speed & Accuracy |
| `gemini-pro-agent` | **Gemini Pro Agent** | Agentic Workflow Specialist |
| `gpt-oss-120b-medium` | **GPT-OSS 120B Medium** | Open Weights SOTA |
| `...` | *Any custom model in your CPA* | Auto-discovered |

---

## 🚀 Quick Start

### 1. Requirements
* VS Code **v1.116.0** or newer.
* GitHub Copilot Chat extension installed.
* Local CPA (EasyCLIProxyAPI) running on `http://127.0.0.1:8317/v1` (or your custom port).

### 2. Installation
1. Download the latest `.vsix` file from [Releases](https://github.com/happyfox-dot/cpa-copilot-chat/releases).
2. In VS Code:
   * Open the Extensions panel (`Ctrl + Shift + X`).
   * Click the `...` menu in the top-right corner.
   * Select **Install from VSIX...** and pick the downloaded `.vsix` file.
3. Reload or restart VS Code.

### 3. Usage
1. Open GitHub Copilot Chat (`Ctrl + Alt + I`).
2. Click the model picker dropdown at the bottom of the chat box.
3. Select **CPA Proxy** -> Choose your desired model (e.g. `Claude Sonnet 4.6`).
4. Enjoy top-tier AI coding with zero subscription limits!

---

## ⚙️ Configuration

In your VS Code `settings.json`:

```json
{
  "cpa-copilot.baseUrl": "http://127.0.0.1:8317/v1",
  "cpa-copilot.apiKey": "123456",
  "cpa-copilot.temperature": 0.3,
  "cpa-copilot.maxTokens": 0
}
```

### Commands (`Ctrl + Shift + P`)
- `CPA: Refresh Models in Copilot Chat`: Re-query local CPA and refresh available models.
- `CPA: Open Settings`: Jump directly to CPA Copilot extension settings.

---

## 📄 License

[MIT License](LICENSE) © 2026 happyfox-dot
