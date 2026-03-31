# Mystery Match (V1 flagship differentiated mode)

**Canonical source of truth for Mystery Match behavior** (eligible pool, narrowing, clues, safety). Strategy placement: [PRODUCT-CONCEPT.md](../PRODUCT-CONCEPT.md), [BLUEPRINT.md](../BLUEPRINT.md), [spark-prompts.md](./spark-prompts.md).

`Mystery Match` is Meetra’s **flagship differentiated** mode — high narrative and product identity — **defined in V1** and documented here in full. **Product strategy** positions **Spark Prompts** as the **first validation mode** (interaction foundation); **Mystery Match** is **layered after** that foundation is validated — **not** because Mystery Match is unimportant, but because it is **richer** and **harder to interpret** as the very first live test.

> **Mystery Match V1 is not a room-wide scavenger hunt. It is a guided narrowing game across the active Meetra participant layer.**

Users should feel they are narrowing a realistic field of active participants, not wandering the whole room on a blind hunt.

---

## V1 definition

- Guided in-room discovery among **active Meetra users opted into Mystery Match**.
- One hidden **AI-selected promising connection** per round.
- Suggestive framing only: likely fit, strong conversation fit, someone you may enjoy meeting.
- Not deterministic matchmaking, not precise person-tracking.

---

## Eligible pool and mixed-adoption realism

- **In play:** only attendees who are both active in Meetra for the event and participating in Mystery Match.
- The assigned target is always within this active layer, not the entire venue crowd.
- This is why V1 works in mixed-adoption events: it does not assume universal app usage.
- Participation legibility can be subtle (`playing tonight`, `in Mystery Match`, `discoverable now`) without noisy badge theater.

---

## Core loop: Talk -> Interact -> Narrow -> Check -> Repeat

- **Talk:** users mingle and have real conversations.
- **Interact / narrow:** progress through real contact and feedback — **action-driven**, not mainly passive timer-based clue drops.
- **Scan (when QR infrastructure applies):** can act as a **core checkpoint** that records contact and drives narrowing — aligned with Meetra’s **long-term QR vision**; **Spark Prompts** does not require QR to validate the interaction thesis first.
- **Check:** product returns progression/elimination feedback and/or stronger next clues.
- **Repeat:** users keep circulating until reveal/confirmation or fallback.

---

## Why checkpoints matter when QR is in play (and why “misses” still count)

- A checkpoint (e.g. scan) turns social interaction into game-state progress.
- A non-match interaction still narrows the field and should feel like forward movement.
- Users should never feel they “wasted” an interaction because it was not the assigned person.

---

## Clue strategy: stronger in V1, still safe

V1 uses **slightly stronger** clues than the softest original framing so narrowing feels practical in live rooms.

Use mostly during-event Social-layer + tonight-context signals:
- conversation hooks / ask-about prompts
- tonight vibe and event intent
- interaction style and social energy
- light interests/traits that help conversation

Do not use:
- exact physical identifiers
- demographic-marker spotting mechanics
- surveillance-style hints or precise tracking cues

Clues must stay **conversation-first** and **privacy-safe**.

---

## Proximity, reveal, and fallback

- Soft proximity/haptics are optional supporting signals (warmth/tension), not primary gameplay.
- Reveal is intentional and delayed (not immediate at assignment).
- Confirmation can include interaction checkpoints (including scan), proximity thresholds, mutual prompts, or host milestones.
- If unresolved in-round, fallback remains graceful (secondary clues, round-end outcomes, or carry-forward into post-event soft match flow).

---

## Safety and agency requirements

- Explicit private exit hatch before/after reveal (skip/stop/leave/pause/hide).
- No forced continuation, no public-rejection framing, no auto-match from reveal state.
- Exit does not replace separate report/block pathways.

---

## Relationship to post-event matching

Mystery Match is during-event only:
- **soft match** = potential/suggestive signal
- **match** = confirmed mutual like after event (chat unlock)

Mystery Match can prioritize recap candidates; it never bypasses mutual-like rules.

---

## Minimal data dependency (V1)

Mystery Match should run on a thin stack:
- social handle (photo, first name, one expressive line)
- tonight context + participation/discoverability state
- clue-safe Social-layer signals

No heavy questionnaire is required for entry.

Related: [PRODUCT-CONCEPT.md](../PRODUCT-CONCEPT.md), [BLUEPRINT.md](../BLUEPRINT.md), [spark-prompts.md](./spark-prompts.md) (first validation mode), [onboarding-model.md](./onboarding-model.md), [progressive-profile.md](./progressive-profile.md).
