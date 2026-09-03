# Changelog

## 0.3.0 - 2026-09-03

- Published Jewel Buddy as a standalone WorkBuddy / CodeBuddy marketplace plugin.
- Unified plugin, MCP server, tool, and `ui://` resource identity as `jewel-buddy`.
- Added the WorkBuddy MCP Apps bridge for initialization, tool-result delivery, resize events, and
  one-message answer submission.
- Updated the interview to `ui://jewel-buddy/interview/v4.html` and aligned its visual language with
  the public GrillMeJewel reference UI.
- Added a zero-dependency localhost HTTP diagnostic mode without changing the default stdio plugin
  transport.
- Added `show_jewel_results`, a presentation-only MCP App that renders generated designs in a result
  gallery and provides a draggable source/result comparison for image-to-image work.
- Fixed result cards that reported an incomplete image even though the main conversation showed the
  generated file. WorkBuddy delivers only `structuredContent` to the Apps iframe, so the result
  payload includes bounded image data there while preserving standard MCP image content for native
  display.
- Fixed result-card metadata and controls being clipped by WorkBuddy's iframe height cap. Result UI
  v3 uses a bounded image stage and omits the disabled navigation row for single-image results.
- Allowed interview option values to begin with a digit (for example `18k_gold`) while keeping
  question and result ids letter-prefixed. This prevents a rejected first tool call from appearing
  as a transient gray placeholder before the model retries with a renamed value.
- Restored the official animated header in the same README location used by the Codex release; the
  runtime interview UI remains unbranded, matching the upstream layout.
- Verified all four discovery rounds, the separate confirmation round, and a real image result in
  WorkBuddy Desktop.

## Historical Codex releases

The entries below describe the repository before the WorkBuddy `0.3.0` port. Their retired Codex
installer and manifest are not part of the current WorkBuddy package.

### 0.2.0 - 2026-08-19

- Expanded Grill Me into four required discovery stages plus separate brief confirmation.
- Added an explicit 1/2/4/8/custom delivery-count choice instead of silently defaulting to one image.
- Added a candidate-distance matrix so multi-image delivery changes at least three visible design axes per direction.
- Versioned the staged interview resource as `interview/v3.html` to avoid stale host caches.
- Added a permanent one-prompt update Runbook with fixed-release migration, observable version fields, and verified rollback.

### 0.1.1

- Refined the public README with a real Apps UI image, clearer workflow, and platform guidance.
- Added official 苏哇科技 brand assets and plugin icon metadata.
- Versioned the branded interview resource as `interview/v2.html` to avoid stale host caches.

### 0.1.0

- Initial standalone `grill-me-jewel` Skill.
- Compact single-question Apps UI for multi-round jewelry interviews.
- Final confirmed brief and Codex gpt-image-2 generation contract.
- Git marketplace with macOS and native Windows lifecycle checks.
- Public release, privacy, package, MCP, and cross-platform CI tests.
