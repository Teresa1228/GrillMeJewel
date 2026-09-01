---
name: jewel-buddy
description: Turn a vague jewelry idea into a confirmed brief and real design images through a four-stage WorkBuddy MCP Apps interview. Use when the user asks for Jewel Buddy, wants a visual jewelry interview, or has no clear product, concept, and output direction. Do not use for an already executable brief or one ordinary clarification.
---

# Jewel Buddy for WorkBuddy

## Purpose

Help a beginner discover and articulate what jewelry they want to design. Complete four purposeful
discovery rounds plus a separate confirmation round, preserve every answer, then use an image
generation tool available in the current WorkBuddy session to generate the requested real designs.

## Interview

1. Read `references/design-frontier.md`. Reuse facts from the conversation and attachments, then
   complete foundation, meaning, design language, and variation/delivery as four submitted Apps UI
   rounds. A known fact moves its stage to a deeper decision; it does not remove the stage.
2. For every round, call `ask_grill_me_questions` as the primary interaction surface with the exact
   `stage` and sequential `round`. Ask one to four currently answerable fields. Discover that exact
   tool name before falling back to prose. Use concise chat questions only after real tool discovery
   fails or the call errors.
3. Use stable lowercase field and option ids. Offer an `other` option when a useful answer may fall
   outside the list. In foundation, ask `delivery_count` unless the user already supplied a count;
   offer `count_1`, `count_2`, `count_4`, `count_8`, and a custom value. Never ask for providers,
   concurrency, internal job ids, API keys, or cost.
4. After submission, summarize only the newly established facts and preserve all earlier answers.
   Continue with the next stage; never answer the user's side of the interview.
5. In variation/delivery, split locked facts from flexible axes. For multiple outputs, define named
   candidate branches that each change at least three visible design axes while preserving product
   identity, wearing logic, and the central story.
6. After four discovery rounds, present the assembled brief through one final
   `ask_grill_me_questions` confirmation round with `stage: confirmation` and `round` 5 or greater. Ask
   whether to confirm it or revise it, with a text field for corrections when needed.
7. After confirmation, read `references/image2-generation.md`, compile one production prompt per
   requested design, discover the real image-generation tool available in WorkBuddy, and invoke it.
   Prefer a native image tool or an installed image-generation MCP. The confirmed brief is the
   source of truth; do not resume interviewing during generation and never invent a tool result.
8. Return the final brief in Markdown under: Objective, Product, Design Direction, Materials and
   Craft, Source Assets, Output Intent, Locked Facts, Flexible Details. Present every real generated
   image inline. Never claim an image exists unless the tool returned it.

## Question Design

- Keep each round to at most four fields and each option set to at most eight choices.
- Prefer single choice for product identity and output intent, multi choice for style or motifs,
  and text only when the answer cannot be represented honestly with options.
- Make choices mutually understandable to a beginner. Avoid internal jewelry workflow jargon.
- A known fact remains immutable unless the user explicitly corrects it.
- Do not invent gemstone grade, origin, certification, size, budget, brand, or manufacturing facts.
- Delivery count is part of the interview, not a hidden default. Preserve an explicit count;
  otherwise collect 1, 2, 4, 8, or a custom count once. Generate that many independent images and
  never use a contact sheet as a substitute.

## Completion

- Confirm that the user explicitly requested the interview or the original idea lacked product,
  concept, and output clarity.
- Confirm every unresolved round used the Apps UI form unless an actual discovery/call failure was
  reported.
- Confirm all four discovery stages were submitted before the separate confirmation round.
- Confirm no round exceeded four fields or repeated an established fact.
- Confirm the accepted delivery count matches the number of generated images.
- Confirm every multi-image candidate changes at least three visible design axes rather than only
  wording, crop, lighting, background, or camera angle.
- Confirm the final brief was explicitly accepted or corrected by the user.
- Confirm the selected WorkBuddy image tool returned the requested number of readable image assets. If image generation
  is unavailable or fails, report the real blocker and keep the confirmed brief for retry; do not
  present a text brief as completed visual delivery.
