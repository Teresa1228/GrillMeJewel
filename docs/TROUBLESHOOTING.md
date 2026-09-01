# Troubleshooting

## Skill is not visible

Run `codebuddy plugin validate ./plugins/grill-me-jewel`, then start with
`codebuddy --plugin-dir ./plugins/grill-me-jewel --serve`. In the Skill picker search for
`Jewel Buddy` or call `/jewel-buddy:grill-me-jewel`.

## Questions appear as plain text

The Skill loaded but the Apps UI MCP probably did not. Run `npm test`, then `/reload-plugins` in
WorkBuddy. Apps UI renders only in Web UI or an IDE-embedded Web UI.

## Form stays on loading

The UI changes to a terminal error after nine seconds. Retry the form call in the same task. If the
error repeats, verify `jewel_buddy_ui` is enabled and inspect the sandbox iframe console for the
`ui/initialize` failure. The widget has no runtime CDN dependency.

## Form submits but the interview does not continue

Confirm the host supports `ui/message`. Inspect the widget request and verify
`_meta['codebuddy.ai/sendMessageMode']` is `send`. Preserve the submitted summary and ask WorkBuddy
to continue the next unresolved round without repeating established facts.

## Image generation does not start

The final brief must be explicitly confirmed first. If it was confirmed, ask WorkBuddy to discover
and use the image-generation tool available in the current session. Missing tool permission or
network access must be reported honestly; the plugin does not accept an API key as a workaround.

## Plugin name conflict

If another installed plugin already uses the `jewel-buddy` name, test this checkout with
`--plugin-dir`; the local plugin takes precedence for that session. Rename or uninstall a plugin
only after the user chooses which one to keep.

## Reload does not pick up changes

Run `/reload-plugins` and start a new conversation. If the old MCP remains registered, stop the
current `codebuddy --plugin-dir` session and start it again from the repository root.
