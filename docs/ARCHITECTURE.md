# Architecture

## Components

- WorkBuddy plugin manifest: `plugins/grill-me-jewel/.codebuddy-plugin/plugin.json`
- Skill: `plugins/grill-me-jewel/skills/grill-me-jewel/`
- Local stdio MCP: `plugins/grill-me-jewel/mcp/server.mjs`
- Apps UI: `plugins/grill-me-jewel/mcp/interview.html`
- Local verification: `npm run doctor`

During development, WorkBuddy loads the plugin with
`codebuddy --plugin-dir ./plugins/grill-me-jewel --serve`. `/reload-plugins` reloads the Skill and
local MCP after edits. The package does not modify conversations, briefs, generated images, or
other user files.

## Data Flow

```text
vague user idea
  -> Jewel Buddy Skill identifies unresolved decisions
  -> ask_grill_me_questions returns structuredContent
  -> sandboxed Apps UI shows one question at a time
  -> updateModelContext stores stable ids, then ui/message writes the action into the same conversation
  -> Skill assembles and confirms the brief
  -> WorkBuddy invokes an available real image-generation tool
```

The MCP never generates images and never receives provider credentials. It creates a local HTML
resource and transports form data over MCP Apps UI JSON-RPC. The conversation remains the interview
state; no server database or cache is used.

## Protocol Boundary

- Outer stdio MCP: `2025-11-25`, newline-delimited JSON, logs never written to stdout.
- Apps UI iframe: `2026-01-26`, JSON-RPC over `window.postMessage`.
- Resource MIME: `text/html;profile=mcp-app`.
- Resource URI: `ui://jewel-buddy/interview/v1.html`.

Breaking UI changes use a new resource URI. The form returns readable summaries plus stable JSON;
it does not return HTML pretending to be an interactive host component.

## Privacy

The plugin reads no credential files, does not require an API key, and sends no interview data to a
project-owned service. Final image generation uses a tool already available and authorized in the
user's WorkBuddy session. The repository public scan covers source content, file names, and Git identities.
