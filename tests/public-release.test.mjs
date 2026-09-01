import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");

test("README and install guide document the WorkBuddy plugin flow", () => {
  const readme = readFileSync(resolve(ROOT, "README.md"), "utf8");
  const install = readFileSync(resolve(ROOT, "INSTALL.md"), "utf8");
  for (const content of [readme, install]) {
    assert.match(content, /codebuddy --plugin-dir \.\/plugins\/grill-me-jewel --serve/);
    assert.match(content, /workbuddy\.cn\/docs\/cli\/mcp-apps/);
  }
  assert.match(readme, /app\.updateModelContext/);
  assert.match(readme, /app\.sendMessage/);
  assert.match(install, /Current widget context \(JSON\)/);
});
