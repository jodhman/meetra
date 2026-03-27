# Product blueprint (vision)

Text sketch of how the app should work end-to-end. Implementation status is noted where relevant; most of this is future. See [APP.md](APP.md) for current state and [.cursor/rules/core-product-concept.mdc](../.cursor/rules/core-product-concept.mdc) for the core concept.

---

## Organisers, modes, and initial scope

- **Target group:** **Singles/dating-event organisers** and **regular event organisers** who want to augment an existing event with a **dating layer** (not just dedicated singles nights). No single “customer archetype”; the platform should work across contexts and crowd types.
- **Modes:** Meetra exposes **different modes** (templates or configurable presets) so each event type gets an appropriate flow: rotations vs lounge-style mingling, competitive vs chill, small group vs large venue, etc. Host picks (or customises) a mode rather than one generic script.
- **Initial launch focus:** Build and ship against **three example event types** as the first concrete modes (**which three — TBD**). Once those are validated, expand the mode catalogue.

**V1 example events (pick three):** *To be decided* — pick across both (a) dedicated singles/dating-event formats and (b) regular event types augmented with a **dating layer** (e.g. intimate house party vs bar singles night vs corporate/community format). Document chosen types and their mode mapping here when set.

---

## Incentives & monetization (organisers-first)

Meetra monetizes from event organisers (not from users repeatedly trying and failing). This **organiser-first** model aligns incentives with the thing that actually matters: event quality, participant comfort, and real in-person connection.

Some dating products are optimized for engagement/retention (a rotten dating-app churn market) rather than mutual outcomes. Meetra is intentionally designed to reward real-world interaction and “meet first, then match” behavior instead of churn.

We position Meetra as the “angels coming to save the dating world” — not with hype, but with a system where incentives support real connection.

## 1. QR codes as core

QR codes are **core and vital** for maximizing interactions. They are used for games, for connecting people, and for keeping track of statistics.

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

Summary: QR = checkpoint + proof of interaction + input to stats + driver of rewards and leaderboards.

---

## 2. Soft match and soft matchmaking

**Soft match (in-app term):** In the app, **soft match** means a *potential* match — nothing is sure, not a confirmed one. Use this term in UI and copy wherever we indicate “might be a match” or “potential.” A **match** is the sure outcome: mutual like, chat unlocked.

### Soft matchmaking (feature)

Beyond “anyone at the event,” we want a **soft matchmaking** layer:

- **Target more specific groups or niches:** e.g. by age range, interests, lifestyle, or intent (casual vs serious).
- **Strong preferences:** Let users (or hosts) express strong preferences so that events or cohorts are better aligned.
- **How it shows up:** Could be event discovery (“events for you”), suggested events, or sub-cohorts within an event (e.g. “under 35” round, “outdoor lovers” corner). It guides who you’re more likely to meet, without replacing the live interaction.

Rule: Soft matchmaking **supplements** the event-based flow; it does not replace “meet in person first, then match after.”

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

---

## 5. Product flow (recap with QR and matchmaking)

- **Pre-event:** Lite profile, join event (invite/link), onboarding; optional soft matchmaking (event suggestions / niches).
- **During event:** No in-app chat/messages. Host runs games; QR used for checkpoints, games, and connecting. **Social profile layer** (conversation fuel) unlocks after interaction milestones where designed. Stats and leaderboards in real time or at end of event. Collecting QRs rewards digitally (more post-event likes, prestige). Temporary anonymity where it reduces embarrassment (e.g. in certain games or actions).
- **Post-event:** **Full profile** to people you interacted with; view attendees (gamified), leaderboards, like flow; more likes allowed or boosted based on QR performance. Soft matches (potentials) vs **match** (mutual like → chat unlocked). Chat remains locked until a mutual match; matching/chat are enabled only after the event. Prestige visible on profile. Anonymity can apply at “right time” (e.g. who liked you revealed only when appropriate).

---

## 6. What to build (when)

- **QR:** Scan flow, QR generation (e.g. per user or per station), link scan → “connection” or game progress, persistence for stats.
- **Stats & leaderboards:** Event-scoped (and optionally global) stats, leaderboard definitions (“top candidate”, “most scans”, etc.), APIs and UI to read/display them.
- **Rewards:** Rules for “more likes per QR” and any caps; profile prestige (badges/titles) and where they appear.
- **Soft matchmaking:** Preferences (profile + event), event tagging/filtering, discovery or suggestions; optional sub-cohorts per event.
- **Minimize embarrassment / temporary anonymity:** Define “right time” per phase or action; UX and data model for temporary anonymity (e.g. anonymous during game, deferred reveal of who liked whom).
- **Progressive profile:** Data model and APIs for Lite / Social / Full visibility rules; unlock triggers (QR, game cohort, etc.); six-block content model; event recap on Full layer.
- **Event modes:** Mode definitions (host UI + attendee experience); **three V1 example events** (TBD) as first-class presets.

This doc is the blueprint; update it as ideas solidify or priorities change.
