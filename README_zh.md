# 🚀 CPA Proxy for Copilot Chat

[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.116%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Release](https://img.shields.io/github/v/release/happyfox-dot/cpa-copilot-chat?color=blue&logo=github)](https://github.com/happyfox-dot/cpa-copilot-chat/releases)

让 **GitHub Copilot Chat** 无缝连接你本地的 **CPA (EasyCLIProxyAPI / CLI Proxy API)** 或**任意兼容 OpenAI / Anthropic 协议的第三方模型供应商（如 DeepSeek、Claude 原生/中转、One API、New API、OpenRouter 等）**。

通过 VS Code 官方原生的 `LanguageModelChatProvider` 接口，将前沿顶级大模型（如 **Claude 3.7 / 4.6 Sonnet**、**Claude Opus 4.6 (Thinking)**、**Gemini 3.8 / 2.0 Flash**、**DeepSeek-R1** 等）直接挂载进 Copilot Chat 对话框与 Agent 模式中，告别官方老旧模型与高昂订阅费！

---

## ✨ 核心特性

- 🖥️ **支持 UI 交互式添加与管理供应商**：无需手动手写复杂的 JSON 配置，按 `Ctrl+Shift+P` 即可通过向导一步步添加、管理或删除供应商！
- 🔀 **支持 OpenAI 与 Anthropic 双协议切换 (`apiMode`)**：
  - `openai` 模式：请求 `/chat/completions`，适配通用中转站、OneAPI/NewAPI、DeepSeek、OpenRouter；
  - `anthropic` 模式：请求原生 `/v1/messages`，使用 `x-api-key` 认证，支持直连 Claude 官方及原生 Claude 代理。
- 🏢 **多供应商自由扩展与聚合**：同时配置多个不同的供应商，所有模型在 Copilot 菜单中聚合分类展示。
- 🔄 **动态自动同步模型**：启动或刷新时，自动从各供应商的 `/models` 接口拉取最新模型列表，无需手动维护。
- ⚡ **原生 SSE 流式传输**：逐字快速流式输出，响应零延迟。
- 🧠 **深度思考过程折叠 (Thinking Mode)**：针对带推理的模型原生支持可折叠的“思考过程”卡片。
- 🖼️ **多模态识图与文件感知 (Vision)**：完美支持在对话框中拖入图片或通过 `#file` 附加代码文件。
- 🤖 **完整适配 Copilot Agent 模式**：深度打通 Function / Tool Calling 机制，支持 Agent 自主查找文件、修改项目代码、执行终端命令。
- 🔒 **100% 本地隐私安全**：插件仅与你配置的地址通信，零遥测。

---

## 🚀 两种方式添加供应商

### 方式一：UI 弹窗交互式添加（最简单推荐 ⭐⭐⭐⭐⭐）

1. 在 VS Code 中按下快捷键 **`Ctrl + Shift + P`**。
2. 输入并选择：**`CPA: Add Provider (UI / 交互式添加供应商)`**。
3. 按照弹出引导依次输入：
   1. **供应商名称**（如 `DeepSeek`、`AnyRouter`、`Claude官方`）；
   2. **协议模式**（选择 `OpenAI 兼容协议` 或 `Anthropic 原生协议`）；
   3. **Base URL**（如 `https://api.deepseek.com/v1`）；
   4. **API Key**（输入你的 Token 密钥）。
4. 点击回车后插件会自动保存并**立即自动刷新 Copilot 模型列表**！

> **需要管理或删除？**  
> 按 `Ctrl + Shift + P` 运行 **`CPA: Manage Providers (UI / 管理及删除供应商)`**，即可一键查看或删除已配置的供应商。

---

### 方式二：在 `settings.json` 中配置

你也可以直接打开 VS Code 的 `settings.json` 手动增加 `cpa-copilot.providers`：

```json
{
  // 默认本地 CPA
  "cpa-copilot.baseUrl": "http://127.0.0.1:8317/v1",
  "cpa-copilot.apiKey": "123456",

  // 扩展供应商列表
  "cpa-copilot.providers": [
    {
      "name": "DeepSeek",
      "baseUrl": "https://api.deepseek.com/v1",
      "apiKey": "sk-your-deepseek-api-key",
      "apiMode": "openai", // 或省略，默认 openai
      "models": ["deepseek-chat", "deepseek-reasoner"]
    },
    {
      "name": "Claude原生反代",
      "baseUrl": "https://your-claude-proxy.com/v1",
      "apiKey": "sk-ant-api03-xxx",
      "apiMode": "anthropic" // 启用 Anthropic 原生协议
    }
  ]
}
```

---

## ⚙️ 快捷命令一览 (`Ctrl + Shift + P`)

| 命令 | 说明 |
| :--- | :--- |
| **`CPA: Add Provider (UI / 交互式添加供应商)`** | 弹窗引导添加新的供应商 |
| **`CPA: Manage Providers (UI / 管理及删除供应商)`** | 弹窗列出并管理/删除现有供应商 |
| **`CPA: Refresh Models in Copilot Chat`** | 立即重新向所有供应商拉取并刷新模型 |
| **`CPA: Open Settings`** | 打开插件可视化设置页 |

---

## 📄 开源许可

本项目基于 [MIT License](LICENSE) 开源。
