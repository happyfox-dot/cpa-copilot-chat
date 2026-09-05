# 🚀 CPA Proxy for Copilot Chat

[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.116%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Release](https://img.shields.io/github/v/release/happyfox-dot/cpa-copilot-chat?color=blue&logo=github)](https://github.com/happyfox-dot/cpa-copilot-chat/releases)

让 **GitHub Copilot Chat** 无缝连接你本地的 **CPA (EasyCLIProxyAPI / CLI Proxy API)** 或**任意兼容 OpenAI 规范的第三方模型供应商（如 DeepSeek、One API、New API、OpenRouter、硅基流动等）**。

通过 VS Code 官方原生的 `LanguageModelChatProvider` 接口，将前沿顶级大模型（如 **Claude 3.7 / 4.6 Sonnet**、**Claude Opus 4.6 (Thinking)**、**Gemini 3.8 / 2.0 Flash**、**DeepSeek-R1** 等）直接挂载进 Copilot Chat 对话框与 Agent 模式中，告别官方老旧模型与高昂订阅费！

---

## ✨ 核心特性

- 🏢 **多供应商自由扩展 (Multi-Provider Support)**：不仅支持本地 CPA，还支持在设置中添加任意数量的第三方供应商（如 DeepSeek 官方接口、中转站 One API、OpenRouter 等），多上游模型聚合在同一个 Copilot 菜单中！
- 🔄 **动态自动同步模型**：启动或刷新时，自动从各供应商的 `/models` 接口获取最新可用模型，并以带前缀的清晰标签展示（例如 `[DeepSeek] DeepSeek V3`），无需手动写死配置。
- ⚡ **原生 SSE 流式传输**：逐字快速流式输出，打字响应无延迟。
- 🧠 **深度思考过程折叠 (Thinking Mode)**：针对带推理的模型（如 `Claude Opus (Thinking)`、`DeepSeek-R1` 等），原生发射 `LanguageModelThinkingPart`，在聊天框中自动呈现可折叠的“思考过程”卡片。
- 🖼️ **多模态识图与文件感知 (Vision)**：完美支持在对话框中拖入图片、截图，或通过 `#file` 附加代码文件，自动转换为标准 Base64 多模态请求。
- 🤖 **完整适配 Copilot Agent 模式**：深度打通 Function / Tool Calling 机制，支持 Agent 自主查找文件、修改项目代码、执行终端命令（如跑测试用例），实现全自动多轮 Agent 编程。
- 🔒 **100% 本地隐私安全**：插件仅与你配置的地址通信，零遥测、不上传任何隐私或代码至未授权服务器。

---

## ⚙️ 多供应商配置说明

默认情况下，插件已连接你本地运行的 CPA（`http://127.0.0.1:8317/v1`）。

如果你还想同时添加 **DeepSeek 官方平台**、**OpenRouter** 或 **自建 One API / New API 中转**，只需在 VS Code 的 `settings.json` 中配置 `cpa-copilot.providers` 数组即可：

```json
{
  // 默认本地 CPA 服务地址与密钥
  "cpa-copilot.baseUrl": "http://127.0.0.1:8317/v1",
  "cpa-copilot.apiKey": "123456",

  // 🚀 添加更多额外的模型供应商
  "cpa-copilot.providers": [
    {
      "name": "DeepSeek",
      "baseUrl": "https://api.deepseek.com/v1",
      "apiKey": "sk-your-deepseek-key",
      "models": ["deepseek-chat", "deepseek-reasoner"] // 可选：指定固定模型或留空自动获取
    },
    {
      "name": "OpenRouter",
      "baseUrl": "https://openrouter.ai/api/v1",
      "apiKey": "sk-or-v1-your-key"
    },
    {
      "name": "OneAPI中转",
      "baseUrl": "https://your-oneapi-domain.com/v1",
      "apiKey": "sk-your-oneapi-token"
    }
  ]
}
```

### 配置生效与快捷命令 (`Ctrl + Shift + P`)
- **`CPA: Refresh Models in Copilot Chat`**：修改配置后运行此命令（或保存 `settings.json`），插件会自动刷新所有供应商的模型列表！
- **`CPA: Open Settings`**：直接打开可视化设置面板。

---

## 📦 支持模型效果示例

在 Copilot Chat 的下拉菜单中，模型会自动加上供应商前缀分类呈现：

* **默认 CPA 模型**：
  * `Claude Opus 4.6 (Thinking)`
  * `Claude Sonnet 4.6`
  * `Gemini 3.8 Flash High`
  * `Gemini 3.7 Flash High`
* **自定义扩展供应商模型**（根据你的配置显示）：
  * `[DeepSeek] DeepSeek V3`
  * `[DeepSeek] DeepSeek R1 (Thinking)`
  * `[OpenRouter] qwen/qwen-2.5-coder-32b-instruct`
  * `[OneAPI中转] ...`

---

## 🚀 快速上手

### 1. 前置要求
* VS Code 版本 **v1.116.0** 或更高版本。
* 已安装 GitHub Copilot 及 GitHub Copilot Chat 扩展。

### 2. 下载与安装
1. 前往本仓库的 [Releases 发布页面](https://github.com/happyfox-dot/cpa-copilot-chat/releases)，下载最新版的 `.vsix` 文件。
2. 打开 VS Code：
   * 按下快捷键 `Ctrl + Shift + X` 打开扩展面板。
   * 点击右上角的 **`...`**（更多操作菜单）。
   * 选择 **从 VSIX 安装... (Install from VSIX...)**，并选择下载的 `.vsix` 文件。
3. 按 `Ctrl + Shift + P` 输入并执行 `Developer: Reload Window`（重新加载窗口）。

### 3. 使用方法
1. 打开左侧的 Copilot Chat 侧边栏（快捷键 `Ctrl + Alt + I`）。
2. 在输入框底部的**模型选择器**下拉菜单中：
   * 找到 **CPA Proxy** 分组。
   * 选择任意一个供应商的模型即可开始使用！

---

## 📄 开源许可

本项目基于 [MIT License](LICENSE) 开源。欢迎提 PR 或 Issue 共同完善！
