# Install Jewel Buddy in WorkBuddy

This is a **one-time** installation runbook for a WorkBuddy `/goal`. Execute it once on the user's
local WorkBuddy host. Do not create an automation, recurring task, monitor, or background installer.
Do not merely explain the commands: perform the safe checks and installation steps, verify the
result, then give the user the one remaining reload command.

## Installation contract

- Source marketplace: `yuyou-dev/GrillMeJewel`
- Marketplace name: `jewel-buddy-marketplace`
- Plugin: `jewel-buddy@jewel-buddy-marketplace`
- Install scope: `user`
- The plugin bundles its own stdio MCP server as `jewel-buddy`; do not add a separate global MCP
  entry and do not replace another `grill-me-jewelry` MCP.
- Keep the four identities aligned: plugin name, MCP key, `serverInfo.name`, and `ui://` authority
  are all `jewel-buddy`.
- Do not request credentials, install runtime packages, delete user data, or modify the user's
  project. Stop and report the exact blocker if the repository cannot be reached or the manifest is
  invalid.

## 1. Locate and check WorkBuddy CLI

Prefer `codebuddy` from `PATH`. On macOS, if it is unavailable, use:

```text
/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/cli/bin/codebuddy
```

Run the resolved CLI with `--version`, confirm `plugin marketplace` and `plugin install` are
available, then confirm `node --version` reports Node.js 20 or newer. Jewel Buddy requires a
WorkBuddy Web UI or IDE surface that supports MCP Apps; terminal print mode cannot render the
widget. Do not install Node or any package automatically if this check fails—report the requirement.

## 2. Register or refresh the marketplace

Inspect the configured marketplaces first. If an entry named `jewel-buddy-marketplace` exists,
verify that its source is exactly the trusted GitHub repository `yuyou-dev/GrillMeJewel`. If the
same name points to any other source, stop and report the conflict; do not update, replace, or install
from it.

If `jewel-buddy-marketplace` is absent, run:

```bash
codebuddy plugin marketplace add yuyou-dev/GrillMeJewel
```

If it already exists, refresh it instead of adding a duplicate:

```bash
codebuddy plugin marketplace update jewel-buddy-marketplace
```

Use the resolved macOS CLI path in place of `codebuddy` when necessary.

## 3. Install or update Jewel Buddy

Inspect installed plugins. If Jewel Buddy is absent, install it in user scope:

```bash
codebuddy plugin install jewel-buddy@jewel-buddy-marketplace --scope user
```

If it is already installed, update the existing installation:

```bash
codebuddy plugin update jewel-buddy@jewel-buddy-marketplace --scope user
```

If the installed entry is disabled, enable it without reinstalling:

```bash
codebuddy plugin enable jewel-buddy@jewel-buddy-marketplace --scope user
```

Do not uninstall the older `grill-me-jewelry` MCP. The WorkBuddy plugin uses the distinct plugin ID
`jewel-buddy` and MCP server ID `jewel-buddy`, so both may coexist.

## 4. Verify and hand back

Run `codebuddy plugin list --json`. Verify that the result contains an enabled `jewel-buddy` sourced
from `jewel-buddy-marketplace` and has no dependency errors. If the CLI reports a manifest, MCP
startup, or permission error, report that exact error and do not claim success.

When verification succeeds, ask the user to send this once in the current WorkBuddy conversation:

```text
/reload-plugins
```

Then give the user this starting prompt:

```text
用 Jewel Buddy 帮我设计一件送给母亲的吊坠；请用可视化表单逐步确认需求，确认后生成并展示设计图。
```

After the reload finishes, start a **new conversation** before sending the prompt. Do not reload
between interview rounds, and do not use an old rendered card as the verification target.

## Developer validation and local run

For a cloned repository, validate and run the working tree without installing it globally:

```bash
npm test
npm run scan:public
npm run doctor
codebuddy plugin validate ./plugins/jewel-buddy
codebuddy --plugin-dir ./plugins/jewel-buddy --serve --open
```

If macOS WorkBuddy Desktop is installed but `codebuddy` is not on `PATH`, replace it with the bundled
CLI path shown above. Keep `--plugin-dir`; it guarantees that the current checkout is loaded instead
of a similarly named global MCP connection.

## Acceptance test

In the WorkBuddy Web UI, send the starting prompt above. Success means:

1. The main conversation calls `ask_grill_me_questions` and renders the single-question widget.
2. Every submission creates exactly one user message containing a readable summary and
   `Current widget context (JSON)`.
3. WorkBuddy automatically opens the next inline round without repeating confirmed facts.
4. After confirmation, the main conversation invokes a real available image-generation tool and
   displays its returned image; if none is available, it reports the real blocker.
5. When ImageGen returns usable `images[].localPath` values, the main conversation calls
   `show_jewel_results` once. WorkBuddy renders a second result card with the same image count;
   image-to-image results provide a draggable source/result divider.

The marketplace/plugin stdio path is the distribution path. If the form remains a gray placeholder
after the checks above, stop claiming success and follow [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
for the separately started HTTP diagnostic path. The HTTP endpoint is a backend transport only;
the interview UI Resource must remain `ui://jewel-buddy/interview/v4.html`; the result card uses
`ui://jewel-buddy/results/v3.html`.

Official references: [WorkBuddy plugin marketplaces](https://www.workbuddy.cn/docs/cli/plugin-marketplaces)
and [WorkBuddy MCP Apps](https://www.workbuddy.cn/docs/cli/mcp-apps).
