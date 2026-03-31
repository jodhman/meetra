# Core product concept

The app is an **event-based dating platform** that enables people to meet and interact in real life through structured, gamified experiences.

**Instead of traditional swiping:** users join or create singles events where **interaction happens first, and matching happens after**.

Meetra is **not trying to look or feel like a generic dating app** — not in visual language, layout clichés, or interaction patterns (endless card stacks, performative profile grids, chat-first energy). The product should read as **event-native and interaction-first**: warm, legible, and distinct so users sense they are in a **live social layer**, not another swipe product with a different logo.

---

## Identity bar (V1): social handle first

**Social handle first. Profile later. Interaction always.**

In Meetra V1, the **minimum persistent identity layer** is a **social handle**: **one photo**, **first name**, and **one expressive line** (a single hook or line that starts conversations — not a full dating profile).

That minimum is enough to **join an event**, be **discoverable** where the product allows it, and **participate in live interaction modes**. Everything beyond it — tags, intention badges, deeper preferences, lifestyle blocks, gallery, bio, compatibility fields — is **progressive** and **must never be required for initial participation**.

This locks Meetra to “meet and interact first” instead of “complete a profile before you belong.”

---

## Product flow

### 1. Pre-Event

Users prepare by:

- Establishing at least a **social handle** (one photo, first name, one expressive line) through **general onboarding**; additional persistent fields are **progressive** and not required before first-time event participation (**Lite** presentation and layers — see progressive profile)
- Joining an event via an invite code or link
- Completing optional **event onboarding** when required by host configuration or selected game mode(s)

**Goal:** Light context before meeting, without replacing real interaction.

**Progressive profile visibility:** Not one profile everywhere — a **layered profile** by phase. **Before:** reduce anxiety / curiosity (Lite). **During:** the profile is a **conversation engine** (talk hooks, vibe state, intent, auto icebreakers, interaction + game layers) — not Tinder-with-events or LinkedIn bios. **After:** Full profile for decision + recap. Aligns with UX progressive disclosure and safety. Full spec: [skills/progressive-profile.md](skills/progressive-profile.md).

**Onboarding model (core):** Meetra uses two onboarding layers. **General onboarding** is persistent and reusable across events (identity basics, interests, conversation hooks, interaction style, broad connection preferences). **Event onboarding** is optional, short, and contextual (tonight’s mood/intent, mode participation, host-specific prompts/consents). Rule: if information is usually true across events, store it in general onboarding; if it is event/mode-specific for tonight, collect it in event onboarding.

### 2. During Event

The app guides **real-world interaction** through structured activities controlled by the event host.

**Principles:**

- **No in-app chat/messages during the event** — focus is on in-person interaction
- The app is a **facilitator**, not a replacement
- **Minimize embarrassment** — e.g. temporary anonymity at the right time so users can participate without fear of exposure when it matters most
- **Focused, minimal UI while the event is active** — the flow and chrome should be **stripped down** to what serves that phase (host instructions, timers, pairings, prompts, conversation-engine surfaces, etc.). Do not surface a full “general app” with unrelated navigation or pre/post-event affordances competing for attention during the live event

**Host capabilities:** Organisers run the event through **modes** suited to the event type — e.g. prompt-driven interaction, timed rotations, icebreakers, structured games. Different events need different flows; Meetra should offer **multiple modes** so organisers can match the format to their crowd and venue.

**App provides:** Instructions, timers, pairings/group assignments, conversation prompts, mode-specific surfaces.

**Spark Prompts (first validation mode — working name)** is Meetra’s **intentional, prompt-driven live interaction mode**: contextual prompts help attendees **start or deepen real conversations** — **interaction-first**, not browsing or hidden-target play. It runs on **social handle** plus **lightweight tonight context** (Social layer + event onboarding); it does **not** require deep profile completion to prove value. It is the **strongest first validation mode** because it isolates the core question — *does Meetra improve in-room conversation?* — without depending on **QR**, checkpoints, or richer game engines that are **harder to interpret** in early tests and **less robust** when adoption is mixed. **Mystery Match** is **not** replaced: Spark **validates the interaction foundation**; Mystery **adds flagship differentiated** game value **on top**. Full spec: [skills/spark-prompts.md](skills/spark-prompts.md).

**V1 mode strategy (sequencing):** Meetra distinguishes **(1) what we validate first** — the **interaction foundation** — from **(2) flagship differentiated modes** and **(3) richer long-term infrastructure**. The **first product question** is whether Meetra can **improve live conversations with minimal friction**. **Spark Prompts** (working name) is the **prompt-driven** mode framed to answer that question; see [skills/spark-prompts.md](skills/spark-prompts.md). **Mystery Match** remains a **flagship differentiated mode** — emotional, narrative, **guided narrowing** within the **active Meetra participant layer** — best layered **after** that foundation is validated, not because it is less important, but because it is **more demanding** to ship and to interpret in early tests. Full sequencing: [Mode sequencing for V1](#mode-sequencing-for-v1).

**Mystery Match (flagship differentiated).**

> **Mystery Match V1 is not a room-wide scavenger hunt.** It is a **guided narrowing game** across the **active Meetra participant layer**.

> **Spark Prompts validates the interaction foundation. Mystery Match builds differentiated game-like value on top of that foundation.**

Only users who are **active in Meetra** and **opted into Mystery Match** are in the **eligible pool**; the assigned **promising connection** is drawn from that layer. The loop is **action-driven** (**talk → interact → narrow → reveal**); **scan** can be a **checkpoint** where product policy requires it — see [skills/mystery-match.md](skills/mystery-match.md). Clues stay **conversation-first** and **conversation-safe**. The mode strengthens the post-event soft match / like path and does **not** bypass mutual-like matching rules.

**Exit hatch (core safety requirement):** Mystery Match includes an explicit private opt-out path so attendees can stop participating in their current assigned connection **at any point**, before or after reveal, without explaining themselves. Exiting should be low-friction, non-punitive, and not framed as a public rejection moment.

**QR codes (long-term vision, not MVP-defining for validation):** QR remains **strategically important** to Meetra’s long-term vision — checkpoints, stats, rewards, organiser tooling, richer games — and stays documented in [BLUEPRINT.md](BLUEPRINT.md). **QR is not required to validate the core interaction thesis in V1**; it is **later interaction infrastructure** layered after the **interaction foundation** is proven, so early validation is not bottlenecked on scan UX or dense checkpoint systems.

**Goal:** Remove awkwardness, minimize embarrassment, and encourage natural interaction.

### 3. Post-Event

After the event:

- Users view attendees they interacted with (gamified experience)
- Users can like people they’re interested in
- Users see who liked them

**If two users like each other:** a **match** is created and a private chat is unlocked.

**Rule:** Matching is allowed **only after the event ends**, and private chat/messages are unlocked **only after a mutual match**.

**In-app terminology:** A **soft match** is the term used in the app for a *potential* match — nothing is sure yet, not a confirmed match. A **match** is the sure outcome when two users like each other (chat unlocked).

---

## Core value proposition

- Real-life interaction comes first
- The app structures and enhances social experiences
- Matching is based on actual encounters, not just profiles
- We minimize embarrassment (e.g. temporary anonymity when it’s most helpful)
- We **deliberately differentiate** from typical dating-app UX and branding so Meetra does not read as “the same app, different name”

---

## Incentives & monetization (organisers-first)

Meetra’s business model is **organiser-first**: we monetize from event organisers, not from the users’ repeated “swipe/fail cycles”.
This alignment matters because it lets us optimize for the outcome that everyone actually wants: participants having a good time, connecting in-person, and leaving the event with meaningful prospects.

Many dating products are optimized for engagement/retention rather than mutual outcomes. Meetra is intentionally designed to be the *opposite*: an incentives-aligned dating layer that helps repair a dating experience shaped by a rotten dating-app churn market.

Think of Meetra as the “angels coming to save the dating world” — not by promising miracles, but by building a system where the incentives reward real-world interactions instead of churn.

## Soft matchmaking

A **soft matchmaking** layer targets more specific groups, niches, or strong preferences (e.g. age, interests, intent). Events or cohorts can be filtered or suggested so users are more likely to meet people in their niche. This complements the event-based flow rather than replacing it.

**Soft match (in-app term):** Use “soft match” in the app to mean a *potential* match — nothing guaranteed, not a sure thing. Contrast with **match**, which is the confirmed outcome (mutual like, chat unlocked).

## Who we serve

**Target group:** **Singles/dating-event organisers** and **regular event organisers** who want to augment an existing event with a **dating layer** — private hosts, bars, dating-event companies, universities, community groups, partnered venues, etc. Meetra supports both dedicated singles events and “dating overlays” inside broader event types.

**Event modes:** Meetra offers **various modes** (presets or configurable flows) so different event types get the right structure — pace, group size, game mix, and (over time) checkpoint/reward depth. One size does not fit all.

**Initial focus (V1):** Ship around **three example event types** as concrete reference implementations. **First validation mode:** **Spark Prompts** (prompt-driven interaction foundation). **Flagship differentiated mode in V1 product definition:** **Mystery Match** (**guided narrowing**, **active participant layer**, **mixed-adoption realism**). Remaining example events/modes are still to be finalised.

---

## Mode sequencing for V1

1. **Prove the interaction layer** with **Spark Prompts** — **prompt-driven**, **social-handle–compatible**, **mixed-adoption–robust**; the strongest first test of whether Meetra improves **in-room conversations** without requiring dense infrastructure or heavier game mechanics.  
2. **Layer flagship differentiated modes** such as **Mystery Match** on top of that validated foundation — stronger narrative and game mechanics, still **conversation-first** and scoped to the **active participant layer**.  
3. **Then** add **stronger QR-driven interaction infrastructure** — stats, rewards, leaderboards, organiser systems — as **later interaction infrastructure**, aligned with the long-term blueprint. **QR remains central to the long-term vision**; it is **not** abandoned, but it is **not** treated as the MVP-defining mechanic for the **first** validation.

---

## Summary

**Meet → Interact → Then Match**

The product serves **event organisers** with **modes** for different event types. **V1 validation** leads with **Spark Prompts** (interaction foundation); **Mystery Match** is the **flagship differentiated** mode (guided narrowing, active participant layer). **QR** remains **long-term infrastructure** (stats, checkpoints, rewards) — **not** required to validate the core interaction thesis first. **Soft matchmaking** targets niches without deterministic “perfect match” claims. **Social handle first, profile later, interaction always:** V1 minimum identity is **one photo + first name + one expressive line**. **Progressive profile visibility** supports **prompt-driven** modes and **structured** modes alike. Experience and UI should **not** default to generic dating-app patterns. **While an event is live, flows and UI stay stripped down.** Onboarding: persistent **general layer** plus optional **event layer**. Blueprint: [BLUEPRINT.md](BLUEPRINT.md). Spark Prompts: [skills/spark-prompts.md](skills/spark-prompts.md). Mystery Match: [skills/mystery-match.md](skills/mystery-match.md). Profile: [skills/progressive-profile.md](skills/progressive-profile.md).
