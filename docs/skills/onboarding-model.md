# Onboarding model (general + event)

Meetra uses a two-level onboarding model:

- **General onboarding** (persistent, reusable across events)
- **Optional event onboarding** (short, contextual, only when needed)

This model supports the core philosophy: **Meet → Interact → Then Match**.

**Canonical V1 framing:** **Social handle first. Profile later. Interaction always.** The **minimum** persistent identity is a **social handle**: **one photo**, **first name**, and **one expressive line**. That is enough to join an event, be discoverable (where enabled), and participate in live modes. **All other general-onboarding fields are progressive and must not gate initial participation.**

**Implementation (app):** Compressed general onboarding ships as `src/app/(app)/profile/onboarding.tsx` (five steps) and persists to `profiles/{uid}`. Optional event onboarding state merges onto `events/{eventId}/members/{uid}` via `src/lib/firestore/event-onboarding.ts` (tonight/mode fields — modes consume this later). *Product direction:* converge implementation so completion/gating aligns with the social-handle floor above (today the app may still collect more before marking onboarding complete — see [profile-flow.md](./profile-flow.md)).

---

## 1) General onboarding (persistent foundation)

General onboarding collects durable information that stays useful across many events and modes.

Purpose:
- Establish the **social handle** floor, then optionally deepen the reusable profile over time
- Power soft matchmaking and compatibility signals (when users have added more)
- Power during-event conversation design and hint generation
- Support post-event decision-making without re-entering stable data each time

**Minimum (V1 floor — must not be gated behind “full profile”):**
- One photo
- First name
- One expressive line (conversation hook / standout line)

Typical additional data (progressive, not required for first participation):
- Core identity beyond the floor (e.g. age/date of birth, more photos)
- Broad dating/connection preferences (gender/looking for, broad intent, age preference where relevant)
- Interests and lifestyle signals
- Vibe/personality/social energy signals
- Additional conversation hooks beyond the one expressive line (`ask me about…`, `I can talk forever about…`, `friends would say…`)
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

## 4) Spark Prompts (first validation mode) — minimal inputs

**Spark Prompts** is designed to run on **minimal, conversation-safe** data — aligned with **social handle first** and **lightweight tonight context**:

- **Social handle** (photo, first name, one expressive line).
- **Tonight signals** — mood, energy, simple labels (e.g. curious, open-minded) via **event onboarding** or quick in-event picks.
- Optional progressive fields (tags, hooks) only as they improve prompt quality — **not** gating first participation.

The **first event-mode layer** can operate without deep profile completion; it powers **prompt-driven interaction**, not browsing. See [spark-prompts.md](./spark-prompts.md).

---

## 5) Mystery Match V1 dependency

Mystery Match V1 is designed for **mixed-adoption live events**: it does **not** require a finished “dating profile.” It depends on a **thin stack**:

- **Social handle** — photo, first name, one expressive line (V1 entry primitive).
- **Tonight / event context** — mood, intent, connection lens (event onboarding or equivalent).
- **Clue-safe signals** — from the **Social / conversation layer** and light persistent fields (vibe, hooks, interaction style), not a long questionnaire.
- **Participation + discoverability state** — opted into Mystery Match, discoverable when allowed, exit/pause controls ([mystery-match.md](./mystery-match.md)).

Heavy compatibility depth is **progressive** and **not** a gate for joining the mode. Event-level setup stays **short**; general onboarding deepens the pool for **stronger conversation-safe clues** over time without blocking first participation.

---

## Related docs

- [Core product concept](../PRODUCT-CONCEPT.md)
- [Product blueprint](../BLUEPRINT.md)
- [Progressive profile visibility](./progressive-profile.md)
- [Spark Prompts](./spark-prompts.md)
- [Mystery Match mode](./mystery-match.md)
