# Onboarding model (general + event)

Meetra uses a two-level onboarding model:

- **General onboarding** (persistent, reusable across events)
- **Optional event onboarding** (short, contextual, only when needed)

This model supports the core philosophy: **Meet → Interact → Then Match**.

---

## 1) General onboarding (persistent foundation)

General onboarding collects durable information that stays useful across many events and modes.

Purpose:
- Build a reusable profile foundation
- Power soft matchmaking and compatibility signals
- Power during-event conversation design and hint generation
- Support post-event decision-making without re-entering stable data each time

Typical data:
- Core identity basics (display name, age/date of birth, photos)
- Broad dating/connection preferences (gender/looking for, broad intent, age preference where relevant)
- Interests and lifestyle signals
- Vibe/personality/social energy signals
- Conversation hooks (`ask me about…`, `I can talk forever about…`, `friends would say…`)
- Hint-safe attributes that can power game clues
- Interaction style signals (introvert/ambivert/extrovert, playful vs deep, slow warm-up vs instant spark, one-on-one vs group energy)

Product principle:
- Keep it lightweight and expressive, not a heavy compatibility exam.

---

## 2) Event onboarding (optional, contextual)

Event onboarding is a fast, mode-dependent layer shown only when needed by host configuration and/or selected mode(s).

Purpose:
- Capture temporary context for tonight
- Adapt behavior to host setup and active mode
- Avoid polluting persistent profile fields with one-night data

Typical uses:
- Confirm participation in a specific mode
- Current intention for tonight
- Current mood / energy level
- Temporary preferences for this event
- Mode-specific settings and consent toggles
- Participation/discoverability controls (pause discoverability, skip current assignment, hide from a mode for this event)
- Event-specific host questions

Product rule:
- If generally true across events -> **general onboarding**
- If specific to tonight / host setup / selected mode -> **event onboarding**

Not every event needs event onboarding, and not every mode requires extra questions.

---

## 3) Progressive profile relationship

The onboarding model feeds profile layers:

- **Lite (pre-event):** low-pressure context
- **Social (during-event):** conversation engine
- **Full (post-event):** richer decision context

General onboarding provides the durable substrate; event onboarding provides temporary tuning.

---

## 4) Mystery Match requirement

Mystery Match should rely mostly on general onboarding and require only light event onboarding.

Event-level Mystery Match setup should stay short, for example:
- Participate tonight? (yes/no)
- Open to being discoverable for others? (yes/no)
- Tonight connection lens (romantic spark / strong conversation / open-minded)
- Tonight energy (gentle / playful / bold / deep)
- Who they would enjoy meeting tonight
- Allowed clue types (interests, vibe, fun facts) and disallowed clue classes (e.g. physical identifiers)
- Exit/discoverability controls for tonight (pause participation, skip assignment, hide from mode)

This keeps mode setup fast while still improving assignment quality and hint relevance.

---

## Related docs

- [Core product concept](../../.cursor/rules/core-product-concept.mdc)
- [Product blueprint](../BLUEPRINT.md)
- [Progressive profile visibility](./progressive-profile.md)
- [Mystery Match mode](./mystery-match.md)
