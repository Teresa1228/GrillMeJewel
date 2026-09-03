import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");

test("README and install guide document the WorkBuddy plugin flow", () => {
  const readme = readFileSync(resolve(ROOT, "README.md"), "utf8");
  const install = readFileSync(resolve(ROOT, "INSTALL.md"), "utf8");
  for (const content of [readme, install]) {
    assert.match(content, /codebuddy --plugin-dir \.\/plugins\/jewel-buddy --serve/);
    assert.match(content, /workbuddy\.cn\/docs\/cli\/mcp-apps/);
  }
  assert.match(readme, /app\.sendMessage/);
  assert.match(readme, /\/goal 一次性完成 Jewel Buddy for WorkBuddy 的安装与验收/);
  assert.match(readme, /不要创建定时任务/);
  assert.match(readme, /\/plugin marketplace add yuyou-dev\/GrillMeJewel/);
  assert.match(readme, /\/plugin install jewel-buddy@jewel-buddy-marketplace/);
  assert.match(readme, /\/reload-plugins/);
  assert.match(readme, /旧消息里的卡片也不会原地更新/);
  assert.match(readme, /`ui:\/\/jewel-buddy\/interview\/v4\.html` 是资源标识/);
  assert.match(readme, /show_jewel_results/);
  assert.match(readme, /图生图/);
  assert.match(readme, /新的、视觉一致的结果卡/);
  assert.doesNotMatch(readme, /await app\.updateModelContext/);
  assert.match(install, /Do not merely explain the commands/);
  assert.match(install, /plugin marketplace update jewel-buddy-marketplace/);
  assert.match(install, /plugin update jewel-buddy@jewel-buddy-marketplace/);
  assert.match(install, /plugin list --json/);
  assert.match(install, /Node\.js 20 or newer/);
  assert.match(install, /same name points to any other source, stop/);
  assert.match(install, /Current widget context \(JSON\)/);
  assert.match(install, /start a \*\*new conversation\*\*/);
});

test("troubleshooting records the high-frequency WorkBuddy failure modes", () => {
  const guide = readFileSync(resolve(ROOT, "docs/TROUBLESHOOTING.md"), "utf8");
  assert.match(guide, /four identities/);
  assert.match(guide, /must all be `jewel-buddy`/);
  assert.match(guide, /Never add\s+`http:\/\/`/);
  assert.match(guide, /Plugin stdio and a manual global connector/);
  assert.match(guide, /old card never hot-reloads/);
  assert.match(guide, /EADDRINUSE/);
  assert.match(guide, /no separate Widget frontend server/);
  assert.match(guide, /increment that resource URI/);
  assert.match(guide, /images\[\]\.localPath/);
  assert.match(guide, /results\/v3\.html/);
});
