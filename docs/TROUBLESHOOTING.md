# Troubleshooting

## First check: the four identities

The plugin name, MCP key, `serverInfo.name`, and `ui://` authority must all be `jewel-buddy`.
Aliases such as `grill-me-jewel`, `wb_jewelry_ui`, or `jewel_buddy_ui` can leave the renderer on a
gray placeholder because the host cannot associate the tool with its UI Resource.

`ui://jewel-buddy/interview/v4.html` is a resource identifier, not a network address. Never add
`http://` to it. Only an HTTP MCP backend uses `http://127.0.0.1:39528/mcp`.

## Skill is not visible

Run `codebuddy plugin validate ./plugins/jewel-buddy`, then start with
`codebuddy --plugin-dir ./plugins/jewel-buddy --serve`. In the Skill picker search for
`Jewel Buddy` or call `/jewel-buddy:jewel-buddy`.

If `codebuddy` is not on `PATH` on macOS, use the CLI bundled in WorkBuddy Desktop:

```text
/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/cli/bin/codebuddy
```

If `codebuddy plugin validate` produces no output and does not terminate, interrupt that process
and run `/plugin-validate /absolute/path/to/plugins/jewel-buddy` in WorkBuddy. Both routes perform
plugin validation. Require an explicit pass/fail result; a hung or interrupted command is
inconclusive, not successful.

## Questions appear as plain text

Apps UI renders only in WorkBuddy Web UI or an IDE-embedded Web UI. Terminal TUI and print mode
intentionally receive the tool's text fallback. In Web UI, verify the plugin is enabled, run
`/reload-plugins` once, and start a new conversation.

## Form stays on loading or becomes a gray rectangle

The widget reports a terminal error after nine seconds when `ui/initialize` fails. If it remains a
360px gray `pending_placeholder`, check these in order:

1. Confirm the plugin manifest contains `"mcpServers": "./.mcp.json"`.
2. Confirm only one `jewel-buddy` connector is enabled. Plugin stdio and a manual global connector
   must not run together.
3. Run `/reload-plugins` once and test in a new conversation; an old card never hot-reloads.
4. Confirm Node.js is version 20 or newer and the plugin process can read `mcp/interview.html`.

For an observable fallback, clone the repository and keep this process running in a terminal:

```bash
npm run serve:http
curl -sS http://127.0.0.1:39528/health
```

The health response must report `ok: true`, `name: jewel-buddy`, and the current version. Configure
one manual WorkBuddy connector with URL `http://127.0.0.1:39528/mcp`, then disable the plugin's
same-name stdio connector for that test. Closing the terminal stops the backend. If startup reports
`EADDRINUSE`, another process owns port `39528`; stop that known process or choose another port and
use the matching connector URL.

There is no separate Widget frontend server: `resources/read` returns the HTML, while stdio or HTTP
is only the MCP backend transport.

## First card is gray, then the model retries and succeeds

This usually means the first tool call failed schema validation before WorkBuddy received a Widget
result. The gray area is the pending tool placeholder, not a rendered blank page. Earlier builds
required every option value to start with a letter, so a natural value such as `18k_gold` failed and
the model retried as `gold_18k`.

Current builds accept lowercase option values that start with a letter or digit. Question ids and
result item ids must still start with a lowercase letter. After updating, restart the development
server when applicable, run `/reload-plugins` once, and verify in a new conversation. Do not rely on
automatic retry as the normal rendering path.

## Form submits but the interview does not continue

Confirm the host supports `ui/message`. The widget sends one message with
`_meta['codebuddy.ai/sendMessageMode'] = 'send'`; it must contain a readable summary and
`Current widget context (JSON)`. A successful form click that only fills the composer indicates the
host did not honor send mode.

## Image generation does not start

The final brief must be explicitly confirmed first. Image generation belongs to the WorkBuddy main
conversation, not to the local MCP server or iframe. Confirm an image tool is installed and allowed
in the current session. Missing permission, network access, or tool availability must be reported
honestly; do not add an API key to Jewel Buddy and do not treat a text brief as an image result.

## Image exists in chat but the result gallery is missing

The image generator and Jewel Buddy are separate tools. After a successful ImageGen call, the main
conversation must read the returned `images[].localPath` and call `show_jewel_results` once. The
result tool accepts only real PNG, JPEG, or WebP content from an absolute local path or a `data:` URI.

The original interview card will not turn into a gallery: WorkBuddy pushes a tool result only to the
widget associated with that tool call. A second, visually consistent result card should appear in the
same conversation. If the image tool returned only a host-private attachment or remote URL, keep the
native chat image; do not convert a guessed URL or path into a fake gallery result.

For image-to-image mode, every item requires both `source_path` and `result_path`. A missing source,
unsupported format, file larger than 12 MiB, or inline gallery larger than 1.5 MiB is rejected. The
1.5 MiB total includes source and result images because WorkBuddy currently forwards only
`structuredContent` to the Apps iframe; duplicating bounded image data there is what keeps the result
card from becoming a gray or incomplete placeholder. Use the native chat display for oversized or
unsupported inputs rather than weakening the file checks.

## Result image is visible but the title or controls are clipped

Update to the build that exposes `ui://jewel-buddy/results/v3.html`, run `/reload-plugins` once, and
create a new result card. Result UI v3 reports the maximum body/document content size instead of the
current iframe viewport, bounds the image stage, and omits the disabled navigation row for a
single-image result. Existing v1/v2 cards are immutable and will remain clipped.

## Reload does not pick up changes

Run `/reload-plugins` only after installation, update, or source changes, then start a new
conversation. If developing with `--plugin-dir`, stop and restart that process when the old MCP
remains registered. After changing an existing Widget contract, increment that resource URI and
update its tests/docs so the host cannot reuse cached HTML. The interview remains
`interview/v4.html`; the result gallery has its own cache boundary at `results/v3.html`.

## Plugin name conflict

If another installed plugin already uses `jewel-buddy`, use `--plugin-dir` to test this checkout;
the local plugin takes precedence for that session. Rename, disable, or uninstall a connector only
after the user chooses which installation to keep.
