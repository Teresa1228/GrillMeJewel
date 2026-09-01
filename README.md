# Jewel Buddy for WorkBuddy

这是基于 [GrillMeJewel](https://github.com/yuyou-dev/GrillMeJewel) 改造的 WorkBuddy / CodeBuddy CLI 版本。它在对话气泡中展示 MCP Apps 表单，把 widget 操作回传为同一主对话里的用户消息，并在 brief 确认后要求 WorkBuddy 调用当前可用的图片生成工具。

## 关键链路

```text
主对话调用 ask_grill_me_questions
  → WorkBuddy 根据 _meta.ui.resourceUri 渲染 widget
  → 用户在 widget 中完成本轮回答
  → app.updateModelContext 写入结构化答案
  → app.sendMessage(send) 把操作变成新的用户消息并立即唤起 agent
  → agent 继续访谈；最终确认后调用真实图片生成工具
  → 图片由 WorkBuddy 主对话原生展示
```

核心代码在：

- `plugins/grill-me-jewel/mcp/server.mjs`：stdio MCP server、tool 与 UI resource。
- `plugins/grill-me-jewel/mcp/interview.html`：WorkBuddy MCP Apps widget。
- `plugins/grill-me-jewel/skills/grill-me-jewel/SKILL.md`：主对话的访谈与出图工作流。
- `plugins/grill-me-jewel/.codebuddy-plugin/plugin.json`：WorkBuddy 插件清单。
- `plugins/grill-me-jewel/.mcp.json`：插件内 MCP 注册。

## 本地运行

要求 Node.js 20+ 和可用的 `codebuddy` CLI。在仓库根目录执行：

```bash
npm test
codebuddy plugin validate ./plugins/grill-me-jewel
codebuddy --plugin-dir ./plugins/grill-me-jewel --serve
```

进入 Web UI 后输入：

```text
请使用 Jewel Buddy 的可视化表单帮我梳理一个珠宝设计。确认 brief 后，用当前可用的图片生成工具生成设计图并展示在主对话中。
```

也可以显式调用插件 Skill：

```text
/jewel-buddy:grill-me-jewel
```

MCP Apps 只在 WorkBuddy/CodeBuddy Web UI 或 IDE 内嵌 Web UI 中展示；终端 TUI 与 print 模式会自动降级为 server 返回的文本内容。详见 [WorkBuddy MCP Apps 接入指南](https://www.workbuddy.cn/docs/cli/mcp-apps)。

## widget 如何“喂”给主对话

提交时 widget 先调用：

```js
await app.updateModelContext({
  content: [{ type: "text", text: summary }],
  structuredContent: { jewelBuddySubmission: payload },
}).catch(() => {});
```

随后调用：

```js
await app.sendMessage({
  role: "user",
  content: [{ type: "text", text: messageWithSummaryAndStableJson }],
  _meta: { "codebuddy.ai/sendMessageMode": "send" },
});
```

`send` 会把消息写成主对话中的用户气泡并立即触发 agent。完整 JSON 同时放在 `ui/message` 文本中，因此即使 `updateModelContext` 不可用，主对话仍能收到本轮状态。确认轮的消息会明确要求 WorkBuddy 调用真实图片生成能力；MCP server 本身不持有密钥、不调用图片供应商，也不会伪造生成成功。

## 安全与兼容性

- widget 内置一个轻量的 MCP Apps JSON-RPC bridge，不依赖运行时 CDN 或包安装。
- CSP 默认拒绝所有外部连接，只允许内联脚本、样式以及 `data:` / `blob:` 图片。
- 图片生成发生在主对话，不发生在 iframe 或本地 MCP server。
- 访谈状态以主对话为事实源，不写数据库、不上传附件。
- 本衍生版本不使用上游品牌图片；上游代码遵循 Apache-2.0，归属见 `NOTICE` 与 `LICENSE`。

完整安装与验收步骤见 [INSTALL.md](INSTALL.md)。
