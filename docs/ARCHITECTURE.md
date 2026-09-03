# Architecture

## Components

- WorkBuddy plugin manifest: `plugins/jewel-buddy/.codebuddy-plugin/plugin.json`
- Skill: `plugins/jewel-buddy/skills/jewel-buddy/`
- Local stdio MCP: `plugins/jewel-buddy/mcp/server.mjs`
- Apps UI: `plugins/jewel-buddy/mcp/interview.html`
- Local verification: `npm run doctor`

During development, WorkBuddy loads the plugin with
`codebuddy --plugin-dir ./plugins/jewel-buddy --serve`. `/reload-plugins` reloads the Skill and
local MCP after edits. The package does not modify conversations, briefs, generated images, or
other user files.

## Data Flow

```text
vague user idea
  -> Jewel Buddy Skill identifies unresolved decisions
  -> ask_grill_me_questions returns structuredContent
  -> sandboxed Apps UI shows one question at a time
  -> ui/message writes a readable summary plus stable ids into the same conversation
  -> Skill assembles and confirms the brief
  -> WorkBuddy invokes an available real image-generation tool
  -> Skill passes returned localPath values to show_jewel_results
  -> a new Apps UI result card renders a gallery or before/after slider
```

The MCP never generates images, uploads them, or receives provider credentials. The result tool only
reads explicitly supplied PNG/JPEG/WebP files or data URIs after generation succeeds. It returns
standard MCP image content for native conversation rendering and the same bounded image bytes in
`structuredContent` for WorkBuddy's Apps iframe, which currently omits image content blocks from its
tool-result notification. It does not persist a copy. The conversation remains the interview state;
no server database or cache is used.

## Protocol Boundary

- Outer MCP: `2025-11-25`; the marketplace plugin uses newline-delimited stdio, while the optional local
  diagnostic mode exposes stateless JSON responses at `http://127.0.0.1:39528/mcp`.
- Apps UI iframe: `2026-01-26`, JSON-RPC over `window.postMessage`.
- Resource MIME: `text/html;profile=mcp-app`.
- MCP server identity and URI authority: `jewel-buddy`.
- Interview resource URI: `ui://jewel-buddy/interview/v4.html`.
- Result resource URI: `ui://jewel-buddy/results/v3.html`.

The verified interview stays on v4; the result surface is v3 so WorkBuddy cannot reuse the earlier
content-index-only or oversized gallery. A generated image tool result is not broadcast to an
older interview iframe. `show_jewel_results` therefore creates a new result card in the same
conversation, which is the reliable MCP Apps tool-result model.

## Privacy

The plugin reads no credential files, does not require an API key, and sends no interview data to a
project-owned service. Final image generation uses a tool already available and authorized in the
user's WorkBuddy session. The repository public scan covers source content, file names, and Git identities.
