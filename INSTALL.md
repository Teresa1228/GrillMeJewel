# Install Jewel Buddy in WorkBuddy

这是一个一次性安装说明，目标是把当前 GitHub 预览分支注册成 WorkBuddy 用户级 stdio
MCP。完成后，用户只需要在 WorkBuddy 的 MCP/连接器页面开启 `jewel-buddy`。不要创建
自动化、定时任务或后台 HTTP 守护进程。

## 安装契约

- 预览仓库：`Teresa1228/GrillMeJewel`
- 固定分支：`codex/workbuddy-port`
- MCP 名称：`jewel-buddy`
- 传输方式：stdio
- Node.js：20 或更高版本
- 不需要运行本地 HTTP 服务，也不使用 `127.0.0.1:39528`
- 不安装运行时依赖，不读取凭证，不修改其他连接器或其他 Skill
- 不允许在 Apps UI 未出现时回退为原生对话卡片或普通文本问答

GitHub 的 `/tree/codex/workbuddy-port` 是浏览器页面地址，不能直接作为 Git clone 或 MCP
地址。安装时必须检出分支本身。

## 给 WorkBuddy 执行的一次性步骤

1. 确认 Node.js 版本：

   ```bash
   node --version
   ```

   低于 20 时停止并报告，不要自动安装系统软件。

2. 使用稳定目录克隆预览分支。若目录已经存在，先确认 `origin` 指向同一仓库；来源不一致
   时停止，不覆盖或删除目录。

   ```bash
   git clone --branch codex/workbuddy-port --single-branch https://github.com/Teresa1228/GrillMeJewel.git ~/.workbuddy/extensions/jewel-buddy
   ```

   已有正确 checkout 时更新：

   ```bash
   git -C ~/.workbuddy/extensions/jewel-buddy fetch origin codex/workbuddy-port
   git -C ~/.workbuddy/extensions/jewel-buddy switch codex/workbuddy-port
   git -C ~/.workbuddy/extensions/jewel-buddy pull --ff-only origin codex/workbuddy-port
   ```

3. 在仓库根目录运行幂等安装器：

   ```bash
   cd ~/.workbuddy/extensions/jewel-buddy
   npm run install:workbuddy
   ```

   安装器会寻找 WorkBuddy 自带的 `codebuddy` CLI，显式使用桌面版的 `~/.workbuddy`
   配置目录，把仓库中唯一的 Jewel Buddy Skill 同步到
   `~/.workbuddy/skills/jewel-buddy/`，并调用官方 `mcp add` 命令注册：

   ```text
   node <稳定目录>/plugins/jewel-buddy/mcp/server.mjs --stdio
   ```

   若发现以前遗留的 `http://127.0.0.1:39528/mcp`，安装器只替换这个已知的同名旧配置。
   如果同名连接器指向其他未知程序，或用户 Skill 目录已有并非本安装器管理的同名内容，
   安装器必须停止，不能覆盖用户配置。

4. 验证真实连接，而不是只相信“添加成功”的提示：

   ```bash
   npm run doctor:workbuddy
   ```

   该命令内部执行 WorkBuddy 的 `mcp list` 健康检查，只以真实握手结果为准。

   成功输出必须包含：

   ```text
   jewel-buddy: ... ✓ Connected
   jewel-buddy Skill: ... ✓ Installed
   ```

   若没有这行，返回完整原始错误并停止；不要让用户继续测试灰屏卡片。

5. 告诉用户打开 **WorkBuddy → 连接器 → 自定义连接**，找到 `jewel-buddy`，核对并信任
   安装器输出的 MCP 脚本路径，然后开启开关。信任是宿主的安全确认，安装器不能替用户
   绕过。随后新建对话再测试。

   当前连接器预览安装不需要 `/reload-plugins`；旧对话里的卡片也不会热更新。若可视化表单
   没有出现，停止当前流程并运行 `npm run doctor:workbuddy`，不要回退到原生对话卡片或用
   普通文本问答模拟表单。

开始设计的提示词：

```text
用 Jewel Buddy 帮我设计一件送给母亲的吊坠；请用可视化表单逐步确认需求，确认后生成并展示设计图。
```

## 已下载仓库的一键入口

- macOS：双击仓库根目录的 `Install Jewel Buddy.command`
- Windows：双击仓库根目录的 `Install Jewel Buddy.cmd`
- 任意受支持平台：运行 `npm run install:workbuddy`

三个入口最终都调用同一个零依赖 Node 安装器，避免文档步骤与真实行为漂移。

## 与正式 Marketplace 的关系

当前预览分支使用连接器安装，是因为 WorkBuddy 2.132 的 directory marketplace 会出现
“命令提示成功但没有 installed registry”的行为，而该版本对 Git URL 的 `#branch` 又没有
正确剥离 fragment。连接器方式仍然使用 stdio，不需要前后端常驻进程。

PR 合并到上游 `main` 后，正式发布应恢复 marketplace 安装。在迁移到正式插件前，先移除
这个预览连接器，避免插件内 MCP 与用户连接器同时注册为 `jewel-buddy`。

## 开发与发布验证

```bash
npm test
npm run scan:public
npm run doctor
codebuddy plugin validate ./plugins/jewel-buddy
```

开发者也可以使用：

```bash
codebuddy --plugin-dir ./plugins/jewel-buddy --serve --open
```

MCP Apps UI 只会在 WorkBuddy Web UI 或 IDE 内嵌 Web UI 中渲染。终端模式不能完成这套
访谈，应停止并提示用户切换界面，不得用原生对话卡片或普通文本问题代替。协议与灰屏排查见 [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)；宿主能力以
[WorkBuddy MCP Apps 文档](https://www.workbuddy.cn/docs/cli/mcp-apps)为准。
