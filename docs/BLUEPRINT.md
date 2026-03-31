# Product blueprint (vision)

Text sketch of how the app should work end-to-end. Implementation status is noted where relevant; most of this is future. See [APP.md](APP.md) for current state and [PRODUCT-CONCEPT.md](PRODUCT-CONCEPT.md) for the core narrative.

**Experience stance:** Meetra should **not** look, read, or behave like a generic swipe/chat dating app — avoid recycled layouts, stock “dating UI” tropes, and engagement patterns that train users to pre-judge or churn. Favor **event-native**, **interaction-first** surfaces that feel distinct and trustworthy in a room, not like a reskinned consumer dating product.

---

## V1 mode strategy (interaction foundation first)

Meetra separates three things:

1. **First validation mode** — prove the **interaction layer** with **minimal friction**: **Spark Prompts** (working name), a **prompt-driven** live mode. The first product question is whether Meetra can **improve in-room conversations** and **reduce awkwardness** — not whether a particular checkpoint mechanic is elegant.

2. **Flagship differentiated mode** — **Mystery Match** remains central to long-term identity: **guided narrowing**, **active participant layer**, **mixed-adoption realism**, **conversation-first** — but it is **not necessarily the best first mode for earliest live validation**; it layers **on top of** a validated interaction foundation.

3. **Later interaction infrastructure** — **QR-forward** stats, rewards, leaderboards, organiser tooling, and richer game loops stay in the **long-term vision** (see §1 QR below). **QR remains strategically important** but is **demoted from “core MVP-defining mechanic”** to **infrastructure introduced after** the core interaction thesis is validated — so QR friction does not muddy whether users want **app-supported live interaction**.

> **Spark Prompts validates the interaction foundation. Mystery Match builds differentiated game-like value on top of that foundation.**

> **QR remains part of Meetra’s long-term infrastructure vision, but it is not required to validate the core interaction thesis in V1.**

**Mixed-adoption realism** motivates this sequencing: a **prompt-driven** mode is **robust** when only a subset of guests use the app; denser checkpoint systems can follow once the foundation is proven.

**Spark Prompts in one strategic line:** a **serious first validation mode** — contextual **live prompts** that improve **approach and conversation**, powered by **social handle + tonight context**, **without** requiring QR or game-depth infrastructure to prove Meetra’s **core interaction thesis**; **Mystery Match** **adds** flagship differentiation **after**, **not instead of**, that proof.

Canonical specs: [skills/spark-prompts.md](skills/spark-prompts.md), [skills/mystery-match.md](skills/mystery-match.md).

---

## Organisers, modes, and initial scope

- **Target group:** **Singles/dating-event organisers** and **regular event organisers** who want to augment an existing event with a **dating layer** (not just dedicated singles nights). No single “customer archetype”; the platform should work across contexts and crowd types.
- **Modes:** Meetra exposes **different modes** (templates or configurable presets) so each event type gets an appropriate flow: prompt-driven interaction, rotations, lounge-style mingling, structured games, etc. Host picks (or customises) a mode rather than one generic script.
- **Initial launch focus:** Build and ship against **three example event types** as reference implementations. **First validation mode:** **Spark Prompts**. **Flagship differentiated mode (V1 definition):** **Mystery Match**. Remaining mode/event examples are still being selected. Once validated, expand the mode catalogue.

**V1 example events:** Lead with **Spark Prompts** as the **foundation** mode; **Mystery Match** as the **differentiated** second-layer mode (**guided narrowing**, **active Meetra layer**). Additional event-type references should still be chosen across both (a) dedicated singles/dating-event formats and (b) regular event types augmented with a **dating layer** (e.g. intimate house party vs bar singles night vs corporate/community format).

---

## Onboarding model (general + event)

Meetra onboarding has two levels:

- **General onboarding (persistent):** Reusable profile and compatibility/conversation foundations that remain useful across events.
- **Event onboarding (optional):** Short, contextual setup used only when needed by host config and/or selected mode.

### Minimum persistent identity (V1 social handle)

Product mantra: **Social handle first. Profile later. Interaction always.**

The **minimum** persistent identity for V1 is a **social handle**:

- **One photo**
- **First name**
- **One expressive line** (conversation-starting hook — not a full bio)

That bar is sufficient to **join an event**, be **discoverable** (where enabled), and **participate in live interaction modes**. Additional fields (age, tags, intention, interests, deeper prefs, gallery, bio, compatibility) are **progressive** and must **not** be required before someone can participate for the first time.

General onboarding may still **invite** richer data over time; it must not **gate** the above minimum.

### General onboarding (persistent foundation)

General onboarding should stay lightweight but expressive and should power pre-event, during-event, and post-event phases without forcing users to re-enter stable information each time.

- **Required floor:** social handle (one photo, first name, one expressive line)
- Core identity basics beyond the floor (e.g. age/date of birth, additional photos) — progressive
- Broad dating/connection preferences (gender/looking for, broad intent, age preferences where relevant)
- Interests + lifestyle signals
- Vibe/personality/social energy signals
- Conversation hooks (e.g. “ask me about…”, “I can talk forever about…”, “friends would say…”)
- Hint-safe attributes that can power games and clues later
- Interaction style signals (introvert/ambivert/extrovert, playful vs deep, slow warm-up vs instant spark, 1:1 vs group energy)

Rule: if information is generally true across many events, it belongs in general onboarding.

### Event onboarding (optional contextual layer)

Event onboarding should be mode-dependent, host-configurable where appropriate, and intentionally short.

- Confirm participation in a specific mode
- Tonight-specific intention, mood, or temporary preferences
- Mode-specific settings and consent toggles (discoverability/interaction mechanics)
- Participation controls such as pause discoverability / skip assignment for this round
- Event-specific host questions

Rule: if information is specific to tonight, host setup, or selected mode, it belongs in event onboarding.

Not every event needs event onboarding, and not every mode needs extra onboarding.

---

## Incentives & monetization (organisers-first)

Meetra monetizes from event organisers (not from users repeatedly trying and failing). This **organiser-first** model aligns incentives with the thing that actually matters: event quality, participant comfort, and real in-person connection.

Some dating products are optimized for engagement/retention (a rotten dating-app churn market) rather than mutual outcomes. Meetra is intentionally designed to reward real-world interaction and “meet first, then match” behavior instead of churn.

We position Meetra as the “angels coming to save the dating world” — not with hype, but with a system where incentives support real connection.

## 1. QR codes (long-term interaction infrastructure)

QR codes remain **central to Meetra’s long-term vision**: maximizing traceable interaction, organiser insight, and gamification — games, connecting people, statistics, rewards, leaderboards. **They are not abandoned.**

For **MVP validation**, however, QR is **not** treated as the **defining mechanic** of the first mode. The early product must first prove it can **improve live conversation** with **low-friction, interaction-first** surfaces; **checkpoint-heavy** flows can **follow** once that thesis holds. **Spark Prompts** deliberately does **not** depend on QR to validate the core question.

When QR is in play (including in **Mystery Match** where scans can act as checkpoints), it functions as **later interaction infrastructure** layered onto an **interaction foundation**, not as a prerequisite for proving Meetra’s basic value.

### Roles of QR

- **Connecting:** Scanning someone’s QR (or a shared event QR) is a way to “connect” or register an interaction — lightweight, in-person, no typing.
- **Games & challenges:** Many challenges or games use QR somehow (e.g. find and scan X people, scan station QRs to complete a round, scan to confirm you did an activity).
- **Checkpoints:** Collecting QRs is what we want users to do as they move through the event. QRs act as **checkpoints** while they navigate the dating landscape — each scan = one more step in the journey.

### Statistics and leaderboards

- QR scans (and other event actions) feed **statistics**.
- **Leaderboards** make the experience social and competitive: “top candidate”, “most scans”, “top connector”, “best at [game]”, etc. Many variants are possible.
- Leaderboards can be event-scoped or (where it makes sense) profile-prestige across events.

### Digital rewards (gamification)

- **Per QR scan:** e.g. more post-event “human likes” (or equivalent currency) — so scanning more QRs during the event gives more capacity or visibility when liking people after the event.
- **Prestige on profile:** Badges, titles, or visible stats (e.g. “Event champion”, “Top connector”) that live on the profile and signal engagement. Strong gamification vibe.

Summary: QR = checkpoint + proof of interaction + input to stats + driver of rewards and leaderboards — **long-term product muscle**, sequenced **after** interaction-layer validation in V1 strategy.

---

## 2. Soft match and soft matchmaking

**Soft match (in-app term):** In the app, **soft match** means a *potential* match — nothing is sure, not a confirmed one. Use this term in UI and copy wherever we indicate “might be a match” or “potential.” A **match** is the sure outcome: mutual like, chat unlocked.

### Soft matchmaking (feature)

Beyond “anyone at the event,” we want a **soft matchmaking** layer:

- **Target more specific groups or niches:** e.g. by age range, interests, lifestyle, or intent (casual vs serious).
- **Strong preferences:** Let users (or hosts) express strong preferences so that events or cohorts are better aligned.
- **How it shows up:** Could be event discovery (“events for you”), suggested events, or sub-cohorts within an event (e.g. “under 35” round, “outdoor lovers” corner). It guides who you’re more likely to meet, without replacing the live interaction.

Rule: Soft matchmaking **supplements** the event-based flow; it does not replace “meet in person first, then match after.” Treat suggestions as supportive/probabilistic guidance, not deterministic guarantees.

### Spark Prompts (V1 first validation mode)

**Working name** — see [skills/spark-prompts.md](skills/spark-prompts.md).

**Definition:** Spark Prompts is Meetra’s **deliberate prompt-driven live interaction mode** — the app issues **contextual, socially useful prompts** so attendees can **start or deepen in-person conversations**. It is **interaction infrastructure for the room**, not a toy feature: it exists to answer whether Meetra **materially improves real conversation** before layering **checkpoint games**, **QR stats**, or **Mystery Match** complexity.

**Inputs:** **Social handle** plus **lightweight tonight context** (vibe, intent, hooks, simple labels) from the **Social layer** and **event onboarding** — enough to personalize prompts **without** full profile depth.

**Why first / why robust in mixed adoption:** Heavier modes assume more **shared behavior** (scans, assignments, game state). When only part of the crowd uses the app, **prompt-driven** interaction stays **legible and shippable**; Spark **validates the thesis** without asking users to master **infrastructure-first** mechanics.

**Relationship to Mystery Match:** Spark **does not replace** Mystery Match. Spark **proves** the **interaction foundation**; Mystery **delivers** flagship **differentiated** game value **on top** of that foundation.

**Core loop (product-level):** **receive prompt → act in person → feedback (e.g. did it / skip)** → **adaptive next prompt** — **state-driven**, not a random feed. **No** required QR for validation.

**Extended definition:** prompt **taxonomy**, **phase mix** (arrival / warm-up / flow / recovery), **named soft-anchors**, **pre-prompt layer**, **ambient awareness** (non-browsing), **soft progression** — [skills/spark-prompts.md](skills/spark-prompts.md).

### Mystery Match (V1 flagship differentiated mode)

> **Mystery Match V1 is not a room-wide scavenger hunt.** It is a **guided narrowing game** across the **active Meetra participant layer**.

**Mystery Match** remains a **flagship differentiated mode** — high narrative and emotional value, **not** demoted in importance — but **product strategy** positions it **after** **Spark Prompts** validates that Meetra can improve live interaction. It is **more demanding** to build and to interpret in early tests; it **builds on** the validated **interaction layer**.

Mystery Match is a **guided in-room discovery loop**: each **opted-in** attendee gets one hidden **AI-selected promising connection** for the round — **likely fit**, **strong conversation fit**, someone they may enjoy meeting (not soulmate/perfect-match language, not deterministic matchmaking). It is **not** a classic blind date mechanic and **not** surveillance-style person-finding.

**Mixed-adoption realism:** The mode is viable when only a **subset** of guests use Meetra because play is **scoped to the active participant layer**, not the entire physical crowd.

#### Eligible pool

- Only users who are **active in Meetra** for the event **and** **participating in Mystery Match** are in the **eligible pool** (assignable and discoverable per product rules).
- The mystery person is **within that layer**, not “anywhere in the venue.” Meetra facilitates **among active users**; it does not assume universal adoption.

#### Legibility of participation (subtle)

Users should feel the mode is happening inside a **recognizable active layer**. Lightweight signals may suggest **playing tonight**, **in Mystery Match**, **discoverable now** — **subtle**; do not turn the event into a badge festival.

#### V1 clue philosophy (stronger, conversation-safe)

V1 uses **slightly stronger** narrowing context than the softest hint-only framing, while avoiding creepy identification.

- **Favor:** social/interaction clues, **tonight’s vibe**, **conversation hooks**, **interaction style**, **event intent** (drawn mainly from the **during-event Social layer** + tonight context).
- **Avoid:** exact physical identifiers, demographic “find the person” games, surveillance-style spotting.

#### Narrowing through interaction (primary loop)

Progress is **action-driven**, not mainly passive time-based unlocks:

- **Talk → interact → narrow → check → repeat** (with **scan** as a **checkpoint** where product policy uses QR as **interaction infrastructure**).
- **Scan** (when used) registers contact and feeds elimination/progression feedback — **later infrastructure**, not required for validating the **Spark Prompts** thesis.
- Clues strengthen through **engagement**; the experience should not feel like **wandering blindly** waiting for timer drops.

**Failed** interactions (e.g. scan after a conversation that is **not** your promising connection) should still feel like **narrowing** and **progress**, not a wasted move.

Optional **soft proximity** can **support** narrowing; it does not replace talk + scan. See “proximity + haptics” below.

### Mystery Match attendee loop (target behavior)

1. User joins event, meets **social handle** + mode entry requirements, opts into Mystery Match.
2. Receives one hidden **promising connection** from the **eligible pool** only.
3. Gets an initial **conversation-safe** clue; narrows through **conversation + scans + feedback** (not room-wide blind search).
4. Receives **stronger clues** as they engage; optional soft proximity as supporting signal.
5. Reveal/confirmation via intentional trigger (not immediate at assignment).
6. After reveal/confirmation, may unlock stronger prompts and post-event prominence — still **not** a confirmed **match** until mutual like after the event.

Design principles: **broad mingling** still; **eligible pool** is **Meetra participants**, not the whole room; **no tunnel vision** on one target to the exclusion of healthy circulation.

### Mystery Match exit hatch (required)

Mystery Match includes an explicit **exit hatch** so users can stop participating in their current assignment at any time, before or after reveal, without needing to explain themselves.

Requirements:
- Private and easy to access
- Socially low-pressure and non-punitive
- Safety-oriented and dignity-preserving
- Framed as leaving/skipping the mode or assignment, not publicly rejecting a person

Before reveal, exit should:
- End current assignment
- Stop hint + proximity guidance for that person
- Allow continuing the event without forced searching

After reveal, exit should:
- Allow disengagement without forced continued interaction
- Avoid implying continued mutual interest
- Never auto-create a confirmed match

Possible product behaviors:
- `stop this match`
- `skip this match`
- `leave this round`
- `reassign later` / `no current assignment`
- `continue event without Mystery Match`
- `hide me from this mode for the rest of event`
- `pause discoverability`

State handling:
- Exiting before reveal removes the active guidance loop.
- Exiting after reveal prevents mode-level implication of continued mutual intent.
- Exit hatch does not replace broader safety/reporting tools; reporting remains separately available.

### Mystery Match hints (detail)

Clue philosophy is summarized above (**V1 clue philosophy**). Hints stay **progressive**, pulled mainly from the **during-event Social layer** (not the full post-event profile), and exist to **facilitate conversation and guided narrowing**, not surveillance-style identification. Canonical behavior: [skills/mystery-match.md](skills/mystery-match.md).

### Mystery Match proximity + haptics (privacy-preserving)

**Role:** Supporting signal for **guided narrowing** — secondary to **talk + scan + feedback**. Desired feel: warm tension/discovery, not radar precision.

- Subtle haptics can increase with broad closeness tiers (`no signal` → `warmer` → `close` → `very close`)
- No exact radar map, no directional arrow, no exact attendee location reveal
- Do not assume precise indoor GPS person-finding
- Favor soft, approximate detection (zone-style/Bluetooth-style proximity)
- Keep haptics subtle and non-spammy (battery + creepiness guardrail)

Document this as intent/constraint, not final implementation claim.

### Mystery Match reveal + fallback

Reveal should feel earned and intentional, with enough mystery to create movement but not so much opacity that users get frustrated.

Possible reveal/confirmation triggers:
- Sustained close proximity threshold
- QR scan between both users
- Both users confirm “I found my match”
- Lightweight verification prompt
- Host/game milestone unlock

If identify/confirm does not happen in-round, provide graceful fallback:
- End-of-round reveal
- Secondary hint unlock
- Carry connection into post-event soft match flow
- Bonus conversation prompt if they connect later

Reveal/confirmation UX must also expose the exit hatch nearby so users can disengage quietly at this stage.

### Mystery Match and post-event matching

Mystery Match is a during-event interaction layer and does **not** replace post-event mutual-like matching.

- **Soft match:** potential/suggestive signal
- **Match:** confirmed mutual like with chat unlocked (post-event only)

Mystery Match should strengthen the path into post-event recap/like flow (e.g. prominence after interaction), not bypass it.

---

## 3. Progressive profile visibility

Meetra uses a **layered profile**, not one static profile everywhere. **Wrong profile = Tinder-with-events, LinkedIn bios, or awkward info dumps.** **Right profile = real-time interaction tool** — especially during the event.

- **Before event — Lite:** Reduce anxiety (“okay to show up?”); curiosity only — strip down (photo, name, 1 hook, few tags).
- **During event — Social (conversation engine):** Enable interaction (“what do I say right now?”) — **talk hooks** (top priority), **real-time vibe/status**, **event-specific intent**, **auto icebreaker card**, **interaction status** after QR/activity, **game-context layer** when a mode is active, **minimal** identity only. **Do not** surface full bio, job, height, dealbreakers, social links — talk first, evaluate later. Often **unlocked after** QR / game cohort / milestone where designed.
- **After event — Full:** Support decision (“see them again?”) — full gallery/bio, compatibility, **interaction recap**, mutual like → chat.

Six content blocks (schema): Identity, Vibe, Conversation, Compatibility (mostly post-event), **Event** (status + recap), Safety/trust. Full philosophy, layout, and V1 spec: [docs/skills/progressive-profile.md](skills/progressive-profile.md).

**During-event app surface (not only profile):** While an event is **active**, the **overall product experience** should stay **focused and minimal** — flows, navigation, and visible UI limited to what contributes to that phase (host mode, timers, scanning, pairings, conversation engine, etc.). Progressive disclosure applies to **chrome** as well as profile content: avoid presenting a full dashboard of unrelated features during the live event.

---

## 4. Minimize embarrassment / temporary anonymity

We want to **minimize embarrassment** so people can engage freely. One lever is **temporary anonymity at the right time**: at certain moments (e.g. during a game, when expressing interest, or when viewing who liked you), identity can be hidden or deferred so that rejection or awkwardness isn’t tied to a face or name until the right moment. Anonymity is temporary and contextual — not permanent — and used when it best reduces fear of exposure and encourages participation. Design features and copy with this in mind; consider when “right time” applies (per phase, per game mode, or per action).

Related requirement: active modes (including Mystery Match) must include a private, low-friction exit hatch so users can opt out of an assignment without creating a visible rejection moment.

---

## 5. Product flow (recap with QR and matchmaking)

- **Pre-event:** Lite profile, join event (invite/link), **general onboarding** foundation + optional **event onboarding** for tonight/mode needs; optional soft matchmaking (event suggestions / niches).
- **During event:** No in-app chat/messages. Host runs modes. **Spark Prompts** — **prompt-driven** interaction foundation (low-friction validation). **Mystery Match** — **guided narrowing**, **active participant layer**, **conversation-safe** clues, **action-driven** progress, optional soft proximity, delayed reveal, failed interactions as **progress**, explicit exit hatch; **scan** as checkpoint where QR infrastructure applies. **QR / stats / rewards** scale in as **later interaction infrastructure** after the foundation is proven — not required for first validation. **Social profile layer** feeds prompts and modes. Temporary anonymity where it reduces embarrassment.
- **Post-event:** **Full profile** to people you interacted with; view attendees (gamified), leaderboards, like flow; more likes allowed or boosted based on QR performance. Soft matches (potentials) vs **match** (mutual like → chat unlocked). Chat remains locked until a mutual match; matching/chat are enabled only after the event. Prestige visible on profile. Anonymity can apply at “right time” (e.g. who liked you revealed only when appropriate).

---

## 6. What to build (when)

- **QR (infrastructure wave):** Scan flow, QR generation (e.g. per user or per station), link scan → “connection” or game progress, persistence for stats — sequenced after **interaction-layer** validation; long-term vision unchanged.
- **Stats & leaderboards:** Event-scoped (and optionally global) stats, leaderboard definitions (“top candidate”, “most scans”, etc.), APIs and UI to read/display them.
- **Rewards:** Rules for “more likes per QR” and any caps; profile prestige (badges/titles) and where they appear.
- **Soft matchmaking:** Preferences (profile + event), event tagging/filtering, discovery or suggestions; optional sub-cohorts per event; keep outputs suggestive/probabilistic.
- **Minimize embarrassment / temporary anonymity:** Define “right time” per phase or action; UX and data model for temporary anonymity (e.g. anonymous during game, deferred reveal of who liked whom).
- **Progressive profile:** Data model and APIs for Lite / Social / Full visibility rules; unlock triggers (QR, game cohort, etc.); six-block content model; event recap on Full layer.
- **Onboarding system:** Persistent general onboarding + optional event onboarding triggers tied to host config/modes.
- **Participation controls:** Mode-level consent + discoverability controls, including Mystery Match exit hatch state handling before/after reveal.
- **Event modes:** Mode definitions (host UI + attendee experience); **Spark Prompts** as **first validation** mode; **Mystery Match** as **flagship differentiated** V1-defined mode; additional V1 examples to finalise.

This doc is the blueprint; update it as ideas solidify or priorities change.
