import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const PLUGIN = resolve(ROOT, "plugins/grill-me-jewel");

test("WorkBuddy plugin manifest and MCP identity are aligned", () => {
  const manifest = JSON.parse(readFileSync(resolve(PLUGIN, ".codebuddy-plugin/plugin.json"), "utf8"));
  const mcp = JSON.parse(readFileSync(resolve(PLUGIN, ".mcp.json"), "utf8"));
  assert.equal(manifest.name, "jewel-buddy");
  assert.equal(manifest.version, "0.1.0");
  assert.equal(manifest.license, "Apache-2.0");
  assert.deepEqual(Object.keys(mcp.mcpServers), ["jewel_buddy_ui"]);
  assert.match(mcp.mcpServers.jewel_buddy_ui.args[0], /CODEBUDDY_PLUGIN_ROOT/);
});

test("the plugin contains one WorkBuddy skill with interview and image handoff rules", () => {
  const skillRoot = resolve(PLUGIN, "skills");
  const skills = readdirSync(skillRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(resolve(skillRoot, entry.name, "SKILL.md")));
  assert.deepEqual(skills.map(({ name }) => name), ["grill-me-jewel"]);
  const skill = readFileSync(resolve(skillRoot, "grill-me-jewel/SKILL.md"), "utf8");
  assert.match(skill, /name: jewel-buddy/);
  assert.match(skill, /ask_grill_me_questions/);
  assert.match(skill, /image-generation tool available in WorkBuddy/);
  assert.match(skill, /four discovery stages/);
  assert.match(skill, /delivery_count/);
  assert.match(skill, /at least three visible design axes/);
  assert.doesNotMatch(skill, /\$imagegen|gpt-image-2|Codex/);
});

test("the active WorkBuddy surface has no OpenAI host bridge dependency", () => {
  const files = [
    resolve(PLUGIN, ".codebuddy-plugin/plugin.json"),
    resolve(PLUGIN, ".mcp.json"),
    resolve(PLUGIN, "mcp/server.mjs"),
    resolve(PLUGIN, "mcp/interview.html"),
    resolve(PLUGIN, "skills/grill-me-jewel/SKILL.md"),
  ];
  const joined = files.map((file) => readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(joined, /window\.openai|openai\/outputTemplate|\.codex-plugin/);
});
