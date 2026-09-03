# Jewel Buddy 0.3.2 Release Checklist

Use this checklist once for a GitHub release. It is not an installer and does not create a
recurring task.

## Repository

- [ ] `package.json`, marketplace metadata, plugin manifest, and MCP `serverInfo.version` all say
      `0.3.2`.
- [ ] `.codebuddy-plugin/marketplace.json` is tracked and points to `./plugins/jewel-buddy`.
- [ ] The public plugin contains exactly one Skill: `plugins/jewel-buddy/skills/jewel-buddy`.
- [ ] `git status --short --ignored` shows local `.workbuddy/` and `generated-images/` only as
      ignored data, never as release files.
- [ ] No credential, private path, QA scratch file, old Codex manifest, or generated image is staged.

## Automated gates

Run from the repository root:

```bash
npm run release:check
npm run doctor:workbuddy
codebuddy plugin validate ./plugins/jewel-buddy
```

If `codebuddy` is not on `PATH` on macOS, use the binary bundled with WorkBuddy Desktop. Do not
publish when any gate fails or hangs without a conclusive validation result. If the CLI validator
opens no output and does not terminate, stop that process and run
`/plugin-validate /absolute/path/to/plugins/jewel-buddy` inside WorkBuddy instead. Record the explicit
pass/fail message; an interrupted process is not a pass.

## WorkBuddy smoke test

1. Run `npm run install:workbuddy` and require `npm run doctor:workbuddy` to show the managed MCP as
   healthy with 2/2 tools and 2 resources, the connector as connected, the user Skill as installed,
   and the Apps UI catalog as ready; or test the tagged checkout with `codebuddy --plugin-dir ./plugins/jewel-buddy --serve --open`.
2. Open WorkBuddy's MCP/connector page, enable `jewel-buddy`, then start a new conversation.
3. Send: `用 Jewel Buddy 帮我设计一件送给母亲的吊坠；请用可视化表单逐步确认需求，确认后生成并展示设计图。`
4. Verify four discovery rounds and a separate confirmation round render as inline Apps UI.
5. Verify every submission produces one user message and automatically advances.
6. Confirm the brief and verify a real image tool returns the requested number of readable images.
7. Verify the agent calls `show_jewel_results` with those real paths and a second inline result card
   renders the same count.
8. Run one image-to-image case and drag the comparison divider from 0 to 100; confirm the left/right
   source and result labels match the visible images.

For gray placeholders, stale cards, duplicate connectors, identity mismatches, port conflicts, or
missing image tools, stop and follow [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## Publish

- [ ] Update `CHANGELOG.md` and release notes.
- [ ] Commit the reviewed worktree.
- [ ] Tag the exact commit as `v0.3.2` and push the tag.
- [ ] Confirm the GitHub Actions Release workflow passes on macOS and Windows.
- [ ] Download the generated ZIP, verify its SHA-256 file, and inspect the archive contents before
      sharing the release.
