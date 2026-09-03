import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

import {
  buildConnectorSpec,
  buildWorkBuddyHandoff,
  classifyExistingConnector,
  classifyExistingSkill,
  connectorMatches,
  restoreConnector,
  skillMatches,
} from "../scripts/workbuddy-connector.mjs";

const ROOT = resolve(import.meta.dirname, "..");

test("one-click installer builds a user-scoped stdio connector without a fixed port", () => {
  const spec = buildConnectorSpec({
    root: ROOT,
    nodeBinary: "/opt/node/bin/node",
    configDir: "/tmp/workbuddy-profile",
  });

  assert.equal(spec.name, "jewel-buddy");
  assert.equal(spec.transport, "stdio");
  assert.equal(spec.configDir, "/tmp/workbuddy-profile");
  assert.equal(spec.skillSource, resolve(ROOT, "plugins/jewel-buddy/skills/jewel-buddy"));
  assert.equal(spec.skillTarget, "/tmp/workbuddy-profile/skills/jewel-buddy");
  assert.deepEqual(spec.command, [
    "/opt/node/bin/node",
    resolve(ROOT, "plugins/jewel-buddy/mcp/server.mjs"),
    "--stdio",
  ]);
  assert.deepEqual(spec.addArgs, [
    "mcp",
    "add",
    "jewel-buddy",
    "--scope",
    "user",
    "--transport",
    "stdio",
    "--",
    ...spec.command,
  ]);
  assert.doesNotMatch(JSON.stringify(spec), /39528|streamableHttp|sse/i);
});

test("connector rollback restores only jewel-buddy and preserves unrelated MCP entries", (t) => {
  const configDir = mkdtempSync(resolve(tmpdir(), "jewel-buddy-rollback-"));
  t.after(() => rmSync(configDir, { recursive: true, force: true }));
  const configPath = resolve(configDir, "mcp.json");
  mkdirSync(configDir, { recursive: true });
  writeFileSync(configPath, `${JSON.stringify({ mcpServers: { unrelated: { command: "other" } } })}\n`);
  const previous = { url: "http://127.0.0.1:39528/mcp", type: "http" };
  restoreConnector(configDir, previous);
  const restored = JSON.parse(readFileSync(configPath, "utf8"));
  assert.deepEqual(restored.mcpServers.unrelated, { command: "other" });
  assert.deepEqual(restored.mcpServers["jewel-buddy"], previous);
});

test("installer requires explicit WorkBuddy trust and forbids native-card fallback", () => {
  const spec = buildConnectorSpec({
    root: ROOT,
    nodeBinary: "/opt/node/bin/node",
    configDir: "/tmp/workbuddy-profile",
  });
  const handoff = buildWorkBuddyHandoff(spec);
  assert.match(handoff, /连接器 → 自定义连接/);
  assert.match(handoff, /信任新安装的 MCP 脚本/);
  assert.match(handoff, /不要回退到原生对话卡片/);
  assert.match(handoff, /Jewel Buddy Skill 已安装到/);
  assert.match(handoff, new RegExp(spec.serverPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("installer treats an absent user Skill as installable and checks the bundled Skill tree", () => {
  const spec = buildConnectorSpec({
    root: ROOT,
    nodeBinary: "/opt/node/bin/node",
    configDir: "/tmp/workbuddy-profile-that-does-not-exist",
  });
  assert.equal(classifyExistingSkill(spec), "missing");
  assert.equal(skillMatches(spec), false);
});

test("installer is idempotent and only auto-replaces the known dead HTTP registration", () => {
  const spec = buildConnectorSpec({
    root: ROOT,
    nodeBinary: "/opt/node/bin/node",
    configDir: "/tmp/workbuddy-profile",
  });

  assert.equal(connectorMatches({ command: spec.command[0], args: spec.command.slice(1) }, spec), true);
  assert.equal(classifyExistingConnector(undefined, spec), "missing");
  assert.equal(classifyExistingConnector({ url: "http://127.0.0.1:39528/mcp" }, spec), "replaceable-http");
  assert.equal(classifyExistingConnector({ command: "python3", args: ["other.py"] }, spec), "conflict");
});

test("public docs expose the branch installer and connector-only handoff", () => {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));
  const readme = readFileSync(resolve(ROOT, "README.md"), "utf8");
  const install = readFileSync(resolve(ROOT, "INSTALL.md"), "utf8");

  assert.equal(pkg.scripts["install:workbuddy"], "node scripts/workbuddy-connector.mjs install");
  assert.equal(pkg.scripts["doctor:workbuddy"], "node scripts/workbuddy-connector.mjs status");
  for (const content of [readme, install]) {
    assert.match(content, /Teresa1228\/GrillMeJewel/);
    assert.match(content, /codex\/workbuddy-port/);
    assert.match(content, /npm run install:workbuddy/);
    assert.match(content, /MCP|连接器/);
  }
  assert.match(install, /mcp list/);
  assert.match(install, /✓ Connected/);
  assert.match(install, /不需要运行本地 HTTP 服务/);
  assert.match(install, /连接器 → 自定义连接/);
  assert.match(install, /信任/);
  assert.match(install, /不要回退到原生对话卡片/);
  assert.match(install, /Skill/);
  const installer = readFileSync(resolve(ROOT, "scripts/workbuddy-connector.mjs"), "utf8");
  assert.match(installer, /CLI_TIMEOUT_MS = 45_000/);
  assert.match(installer, /ETIMEDOUT/);
});
