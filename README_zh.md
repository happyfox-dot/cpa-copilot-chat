# 🚀 CPA Proxy for Copilot Chat

[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.116%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Release](https://img.shields.io/github/v/release/happyfox-dot/cpa-copilot-chat?color=blue&logo=github)](https://github.com/happyfox-dot/cpa-copilot-chat/releases)

让 **GitHub Copilot Chat** 无缝连接你本地的 **CPA (EasyCLIProxyAPI / CLI Proxy API)** 反代服务。

通过 VS Code 官方原生的 `LanguageModelChatProvider` 接口，将你 CPA 中的前沿顶级大模型（如 **Claude 3.7 / 4.6 Sonnet**、**Claude Opus 4.6 (Thinking)**、**Gemini 3.8 / 2.0 Flash**、**DeepSeek-R1** 等）直接挂载进 Copilot Chat 对话框与 Agent 模式中，告别官方老旧模型与高昂订阅费！

---

## ✨ 核心特性

- 🔄 **动态自动同步模型**：启动或刷新时，自动从 `http://127.0.0.1:8317/v1/models` 获取可用模型列表。只要你在 CPA 中添加或调整了模型，Copilot Chat 下拉列表就会立刻自动以整洁的原名展示，无需手动修改代码配置。
- ⚡ **原生 SSE 流式传输**：逐字快速流式输出，打字响应无延迟。
- 🧠 **深度思考过程折叠 (Thinking Mode)**：针对带推理的模型（如 `Claude Opus (Thinking)`、`DeepSeek-R1` 等），原生发射 `LanguageModelThinkingPart`，在聊天框中自动呈现可折叠的“思考过程”卡片。
- 🖼️ **多模态识图与文件感知 (Vision)**：完美支持在对话框中拖入图片、截图，或通过 `#file` 附加代码文件，自动转换为标准 Base64 多模态请求。
- 🤖 **完整适配 Copilot Agent 模式**：深度打通 Function / Tool Calling 机制，支持 Agent 自主查找文件、修改项目代码、执行终端命令（如跑测试用例），实现全自动多轮 Agent 编程。
- 🔒 **100% 本地隐私安全**：插件仅与本地环回地址通信（默认 `127.0.0.1:8317`），零遥测、不上传任何隐私或代码至第三方服务器。

---

## 📦 支持模型示例

只要本地 CPA 正在运行，模型就会按友好的中文/规范原名在 Copilot 中显示：

| 模型 ID | Copilot Chat 中显示的名称 | 支持特性 |
| :--- | :--- | :--- |
| `claude-opus-4-6-thinking` | **Claude Opus 4.6 (Thinking)** | 深度逻辑推理、工具调用、识图 |
| `claude-sonnet-4-6` | **Claude Sonnet 4.6** | 顶级编程代码能力、工具调用 |
| `gemini-3.8-flash-high` | **Gemini 3.8 Flash High** | 超长上下文、极速响应、多模态 |
| `gemini-3.7-flash-high` | **Gemini 3.7 Flash High** | 高速高精度编程 |
| `gemini-pro-agent` | **Gemini Pro Agent** | 复杂工作流与 Agent 专精 |
| `gpt-oss-120b-medium` | **GPT-OSS 120B Medium** | 开源顶尖模型 |
| *其他任意模型* | *自动发现并格式化名称* | 随配随用 |

---

## 🚀 快速上手

### 1. 前置要求
* VS Code 版本 **v1.116.0** 或更高版本。
* 已安装 GitHub Copilot 及 GitHub Copilot Chat 扩展。
* 本地运行中的 CPA（EasyCLIProxyAPI）服务（默认监听 `http://127.0.0.1:8317/v1`）。

### 2. 下载与安装
1. 前往本仓库的 [Releases 发布页面](https://github.com/happyfox-dot/cpa-copilot-chat/releases)，下载最新版的 `.vsix` 文件（例如 `cpa-copilot-chat-1.0.0.vsix`）。
2. 打开 VS Code：
   * 按下快捷键 `Ctrl + Shift + X` 打开扩展面板。
   * 点击右上角的 **`...`**（更多操作菜单）。
   * 选择 **从 VSIX 安装... (Install from VSIX...)**，并选择下载的 `.vsix` 文件。
3. 按 `Ctrl + Shift + P` 输入并执行 `Developer: Reload Window`（重新加载窗口）或重启 VS Code。

### 3. 使用方法
1. 打开左侧的 Copilot Chat 侧边栏（快捷键 `Ctrl + Alt + I`）。
2. 在输入框底部的**模型选择器**下拉菜单中：
   * 找到 **CPA Proxy** 分组。
   * 选择你想使用的模型（例如 `Claude Sonnet 4.6` 或 `Gemini 3.8 Flash High`）。
3. 开始提问或让 Agent 协助你编写代码！

---

## ⚙️ 配置说明

插件开箱即用，默认匹配标准 CPA 参数。如需自定义端口或密钥，可在 VS Code 的 `settings.json` 中配置：

```json
{
  // 本地 CPA 服务地址（必须带 /v1）
  "cpa-copilot.baseUrl": "http://127.0.0.1:8317/v1",

  // CPA 接口的 API Key（默认为 123456）
  "cpa-copilot.apiKey": "123456",

  // 采样温度（0 ~ 2 之间，编程推荐 0.2 ~ 0.5）
  "cpa-copilot.temperature": 0.3,

  // 最大生成 Token 上限（填 0 则使用模型自身默认上限）
  "cpa-copilot.maxTokens": 0
}
```

### 快捷命令 (`Ctrl + Shift + P`)
- **`CPA: Refresh Models in Copilot Chat`**：强制重新请求本地 CPA 并刷新 Copilot Chat 中的模型列表。
- **`CPA: Open Settings`**：直接打开本插件的可视化设置面板。

---

## ❓ 常见问题

**Q: 聊天框报错 `CPA Proxy API error (404/model_not_found)`？**
* 请确认你的本地 CPA 服务是否正在后台运行，且运行在 `8317` 端口。
* 按 `Ctrl + Shift + P` 运行 `CPA: Refresh Models in Copilot Chat` 重新同步一次模型列表。

**Q: 这个插件支持在编辑器里打字时的 Tab 键行内自动补全吗？**
* 本插件对接的是 **Copilot Chat（对话窗口）** 与 **Copilot Agent 模式（多文件自主编写与终端操作）**。
* 编辑器敲代码时的半透明灰色影子补全（Inline Ghost Text）属于 GitHub 官方写死在其云端服务器上的私有机制，不开放第三方 Provider 接入。如需本地模型的代码补全，推荐配合使用 Continue 等扩展。

---

## 📄 开源许可

本项目基于 [MIT License](LICENSE) 开源。欢迎提 PR 或 Issue 共同完善！
