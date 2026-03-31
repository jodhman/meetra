# Spark Prompts (V1 first validation mode)

**Working name** — product naming may evolve; docs use **Spark Prompts** as the placeholder.

**Canonical product spec for Meetra’s first validation mode.** Spark Prompts is a **state-driven interaction system**, not a loose “prompt of the day” — prompts adapt to **user and event state**, **feedback**, and **progression**. Strategy context: [PRODUCT-CONCEPT.md](../PRODUCT-CONCEPT.md), [BLUEPRINT.md](../BLUEPRINT.md).

---

## First validation question

> Can Meetra meaningfully improve real-world conversations at minimal friction?

**Spark Prompts validates the interaction foundation.** [Mystery Match](./mystery-match.md) builds **differentiated, game-like value** on top of that foundation.

---

## Definition

**Spark Prompts** is Meetra’s **state-driven behavioral system for real-world interaction**: during an event, the app issues **contextual prompts** that drive **approach, movement, and depth** in the room. It draws on **social handle** plus **lightweight tonight context** (Social layer + event onboarding). In **mixed-adoption** venues it stays **robust** without QR rails, assignment engines, or universal participation.

**Outcome framing:** Spark evolves from “a prompt feature” → **a real-time social interaction engine** — the **foundation** on which modes like **Mystery Match** layer.

---

## Core principle (non-negotiable)

Prompts are **behavioral triggers**, not content.

Each prompt must:

- **Lower approach friction**
- **Provide language to speak**
- **Create movement** in the room

If a prompt does not influence **real-world behavior**, it should not exist.

---

## Prompt taxonomy (five types)

### 1. Icebreaker prompts (entry)

**Purpose:** Enable immediate conversation.

- Broad, low-effort, minimal cognitive load
- **Dominant early** in the event

Examples: “Ask someone what they could talk about for hours”; “Find someone who hates mornings.”

### 2. Directional prompts (movement)

**Purpose:** Prevent stagnation and improve **circulation**.

- Behavior-driven, not content trivia

Examples: “Talk to someone you haven’t met yet”; “Find someone standing alone and say hi.”

### 3. Deepening prompts (quality)

**Purpose:** Increase **conversation depth** — typically **after** initial contact.

Examples: “What’s something you’ve changed your mind about recently?”; “What’s a risk that paid off for you?”

### 4. Named prompts (soft anchoring)

**Purpose:** Reduce friction **selectively** using **first name only** — **soft anchors**, not hunt targets.

**Rules:**

- **~Max 20%** of prompts (product tuning)
- **Only one** active named prompt at a time
- **First name only** — no physical or location identifiers
- Never framed as a **command** (“go find Emma”)

Examples: “There’s a *Maja* here who loves chaotic stories”; “If you run into *Erik*, ask him what he’s obsessed with.”

**Anti-patterns:** Multiple named targets; precise identification; stalker energy.

### 5. Momentum prompts (recovery)

**Purpose:** Re-engage **stuck** users.

**Triggered by** (product signals): inactivity, repeated very short interactions, hesitation patterns.

Examples: “Reset: ask someone the simplest question you can think of”; “Try a completely different type of person next.”

---

## State-driven prompt system

Prompts are **not random** — they adapt to **phase** and **user state**. Percentages below are **strategic targets** (implementation may smooth or blend).

### State A — Arrival (~0–10 min)

| Mix | Goal |
|-----|------|
| ~70% Icebreaker, ~20% Directional, ~10% Named | **First interaction quickly** |

### State B — Warm-up (~10–30 min)

| Mix | Goal |
|-----|------|
| ~40% Icebreaker, ~30% Directional, ~20% Deepening, ~10% Named | **Build rhythm** |

### State C — Flow (~30+ min)

| Mix | Goal |
|-----|------|
| ~50% Deepening, ~20% Directional, ~20% Named, ~10% Momentum | **Quality + serendipity** |

### State D — Stuck / drop-off

| Mix | Goal |
|-----|------|
| ~60% Momentum, ~30% Icebreaker, ~10% Named | **Behavioral reset** |

---

## Named prompts (detailed)

**When names appear**

- **Early** — sparingly, to reduce initial friction (within Named cap)
- **After 2–3 interactions** — can surface as **progression** (still soft)

**Framing styles**

- Soft curiosity: “There’s a Sara here who…”
- Conditional: “If you run into Jonas…”
- Suggestive: “You might enjoy talking to Emma”

**Core rule:** Names are **soft anchors**, not **targets** — never precision hunt language.

---

## Prompt construction

Product-level structure:

**[Framing] + [Action] + [Target] + [Hook]**

Example: “Quick one → ask someone what they could talk about for hours.”

---

## Pre-prompt layer (optional UX)

A **subtle** layer (e.g. simulated internal dialogue) **before** the main prompt.

**Purpose:** Normalize hesitation, model conversational starters, reduce approach anxiety.

**Examples (tone):** “umm… how do I start this”; “ok just say it”; “this might be random but…”

**Behavior:** Low prominence (e.g. background, low opacity); typing / deleting animation acceptable; **must not compete** with the primary prompt. **Future:** May adapt to shy vs confident signals.

---

## Feedback loop (essential)

**User inputs (examples):** “Did it” · “Skip” · passive timeout / no action.

**System response (directional):**

- After **Did it:** subtle positive feedback + **adaptive** next prompt
- After **Skip:** **easier** or more **directional** prompt (reduce friction)

**Purpose:** Maintain **momentum** without heavy gamification (no points/leaderboards in this mode).

---

## Ambient awareness layer (non-browsing)

**Allowed (examples):** “12 people are active”; “Some nearby are open to chatting”; “People picked ‘deep talks’ tonight.”

**Not allowed:** User lists, profile browsing, maps, precise tracking.

**Principle:** **Directional awareness**, not **informational browsing**.

---

## Progression (soft)

**Signals (examples):** “You’ve talked to 3 people”; “You’ve tried 2 prompts.”

**Unlocks (examples):** Named prompts, deeper prompts, slight personalization — **light**, not a full meta-game.

**Constraint:** No heavy gamification here (no points, no Spark leaderboards).

---

## UX structure (directional)

| Zone | Role |
|------|------|
| **Top** | Pre-prompt animation (subtle, if used) |
| **Center** | **Main prompt** (primary focus) |
| **Bottom** | Actions — e.g. **Did it** / **Skip** |
| **Background** | Minimal, calm, non-distracting |

---

## Behavioral model

Spark Prompts should feel like:

> “I don’t have to think — I just act.”

**Not:** a content feed · a user browser · a generic game shell.

**Yes:** a **real-time social interaction engine** — **interaction-first** always.

---

## Critical constraints

- No user **browsing** or directories
- No **precise targeting**, including with names (soft anchor only)
- **Interaction-first** always; **minimal cognitive load**
- Must work under **mixed-adoption** conditions
- **No heavy gamification** in Spark itself (save stats/rewards for later infrastructure)

---

## Why it is the strongest first validation mode

- **Isolates the thesis** — conversation lift, not checkpoint polish  
- **Lower cognitive load** in noisy rooms  
- **Mixed-adoption friendly**  
- **Infrastructure-light** — no QR required to validate core value  
- **Foundation for Mystery Match and QR layers** — same interaction-first core  

---

## Social handle + tonight context

Spark aligns with **social handle first**: hooks, vibe, tonight labels, light intent — enough to personalize **without** full profile depth. **Event onboarding** tunes **tonight-only** signals.

---

## Complement to Mystery Match

- **Spark Prompts** → prove **“does Meetra help people talk?”** via a **state-driven prompt engine**  
- **Mystery Match** → flagship **differentiated** mode on a **validated** interaction layer  

Both stay **central** to product identity; Spark is **sequenced first** for validation clarity, not importance ranking.

---

## Related docs

- [Progressive profile visibility](./progressive-profile.md) — Social layer as prompt fuel  
- [Onboarding model](./onboarding-model.md) — minimal event-mode inputs  
- [Mystery Match](./mystery-match.md) — flagship mode on top of this foundation  
