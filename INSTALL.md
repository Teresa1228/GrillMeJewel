# Install Jewel Buddy in WorkBuddy

## Prerequisites

- Node.js 20+
- WorkBuddy / CodeBuddy CLI 已安装并登录
- 使用 Web UI（`--serve`）或 IDE 内嵌 Web UI；终端 TUI 不渲染 MCP Apps
- 如需最终出图，当前 WorkBuddy 会话必须有一个真实可用的图片生成工具

## Validate and run locally

在仓库根目录执行：

```bash
npm test
codebuddy plugin validate ./plugins/grill-me-jewel
codebuddy --plugin-dir ./plugins/grill-me-jewel --serve
```

插件通过 `.mcp.json` 启动 `jewel_buddy_ui`。如果你修改了插件，可在 WorkBuddy 中运行 `/reload-plugins`，无需重新安装。

## Acceptance test

在 WorkBuddy Web UI 的新对话输入：

```text
请使用 Jewel Buddy 的可视化表单梳理一个送给母亲的珠宝设计。确认 brief 后，用当前可用的图片生成工具生成一张设计图并展示在主对话中。
```

成功标准：

1. 主对话调用 `ask_grill_me_questions`。
2. 对话气泡内出现单题分页 widget。
3. 提交后主对话出现包含可读摘要与 `Current widget context (JSON)` 的用户消息。
4. 前四轮继续访谈且不重复已确认事实。
5. 确认轮后主对话调用真实图片生成工具；有权限时展示图片，无权限时如实说明阻塞。

## Troubleshooting

- 表单只显示文本：确认正在使用 `--serve` 或 IDE Web UI，而不是终端 TUI。
- 表单无法加载：打开 DevTools 的 sandbox iframe console，检查 `ui/initialize` 是否成功返回。
- 提交后对话不继续：在 DevTools 中确认 `ui/message` 成功，并检查 `_meta['codebuddy.ai/sendMessageMode']` 为 `send`。
- 不出图：确认 WorkBuddy 会话已经安装并授权图片生成工具；本插件不内置图片供应商。

官方协议说明：[WorkBuddy MCP Apps 接入指南](https://www.workbuddy.cn/docs/cli/mcp-apps)。
