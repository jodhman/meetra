# Progressive profile visibility (Meetra)

**Progressive profile visibility** is a core product pattern: not “one profile everywhere,” but a **layered profile** that changes by phase. It fits **UX** (progressive disclosure) and **safety** (limit early personal disclosure).

Aligned with event-networking products: pre-, during-, and post-event engagement differ; attendee data improves connection quality across the lifecycle.

---

## If you get the profile wrong vs right

**Wrong → the app becomes:**

- **Tinder with events** — full pre-judging, swipe energy at the venue
- **LinkedIn-style bios** — résumé energy, not social energy
- **Awkward info dump** — cognitive overload, silent judging instead of talking

**Right → the profile becomes:**

- A **real-time interaction tool** — something that helps people **approach, talk, and continue** in the moment

---

## Reframing the profile (critical shift)

**Stop thinking:** “What information should a profile contain?”

**Start thinking:** “**What should this profile enable someone to do right now?**”

### Philosophy

- **Bad framing:** “Here’s information about a person.”
- **Good framing:** “**Here’s how to interact with this person.**”

### Product contrast

- **Typical swipe apps:** Profile → Chat → Meet  
- **Meetra:** **Meet → Interact → Then** (full) **Profile**

So the “profile” is **not a static object** during the event — it’s a **real-time social tool** (a **conversation engine**).

---

## The three contexts (redefined)

| Phase | Job to be done |
|-------|----------------|
| **1. Before event — reduce anxiety** | “**Do I feel okay showing up?**” |
| **2. During event — enable interaction** *(most important)* | “**What do I say to this person right now?**” |
| **3. After event — support decision** | “**Do I want to see them again?**” |

---

## Key insight: during-event = conversation engine

**Rule:** During the event, the profile should **not** read like a classic “profile.” It should be a **conversation engine**: everything shown must directly help someone **approach**, **talk**, or **continue** a conversation.

During the event there is **no in-app chat/messages**; the profile acts as an in-person conversation engine.

**Replace static info with actionable info** — instead of leading with job, long bio, or generic interests alone, prioritize hooks, vibe, intent, and app-generated openers.

---

## During-event profile (core design)

### 1. Talk hooks (top priority)

Designed for **opening** conversations. Examples:

- “Ask me about the time I got stuck in Japan”
- “I have a very controversial pizza opinion”
- “I once quit my job on a whim”

Prominent UI: **“Ask me about…”** or standout prompt — **most important during-event feature.**

### 2. Energy / vibe state (real-time)

Let users set or refresh how they feel **at this event**, e.g.:

- “Feeling social”
- “A bit shy, come say hi”
- “Only talked to 2 people so far”
- “Looking for deep conversations”

**Why:** Lowers approach anxiety, gives **permission** to engage.

### 3. Interaction intent (context-specific)

Not only generic “looking for relationship.” Prefer **event-native** labels, e.g.:

- “Let’s play games”
- “Open to flirting”
- “Here for fun conversations”
- “Trying to meet everyone”

**Context-specific beats generic dating labels** during the event.

### 4. Instant icebreaker card (dynamic)

**App-generated** when viewing someone, e.g.:

- “You both love travel — ask about their last trip”
- “They hate mornings. Are you the opposite?”
- “Ask them: what’s your most chaotic story?”

Turns the app into a **lightweight social assistant**.

### 5. Interaction status

After QR or shared activity, e.g.:

- “You’ve met”
- “You talked for ~5 min”
- “You completed a game together”

**Why:** Reinforces memory, reduces awkward re-intros.

### 6. Game context layer

During a game, show **only what helps that activity** (e.g. “Find someone who…” → highlight relevant traits, show hints). **The profile adapts to the active mode.**

### 7. Light personal signals (minimal)

Still needed, but **lightweight** during event:

- First name, age
- **1–2 photos** (not a full gallery)
- **≤3 tags**

Nothing more on the **surface** — depth comes through hooks and interaction, not a wall of fields.

---

### Do NOT show during event

Remove anything that encourages **silent judging** before talking:

- Full bio
- Job / company
- Height
- Long preferences / dealbreakers
- Follower counts / social links
- Anything that feels like “evaluate from a distance”

**Why:** **Talk first, evaluate later.**

---

### Final structure: during-event profile (layout)

**Top card**

- Photo, name, age  
- 2–3 vibe tags  

**Talk hook (big, prominent)** — “Ask me about…” or standout prompt  

**Vibe / status** — real-time energy, social mood  

**Intent** — what they want **from this event**  

**Icebreaker (auto-generated)** — contextual suggestion  

**Interaction status** — met / not met, shared activity  

**Game layer (if active)** — context-specific info only  

---

## How it evolves across stages

| Stage | Focus | What to show |
|-------|--------|----------------|
| **Before** | Curiosity only | Photo, name, **1 hook**, **2 tags** — strip it down |
| **During** | Interaction-first | Full during-event structure above — **primary product focus** |
| **After** | Decision mode | Full profile, bio, compatibility, **recap** — evaluate with real-world context |

---

## Three-layer profile system (summary)

### Lite — before the event

Same goals as above: **reduce anxiety**, **curiosity**, low-risk disclosure. No full pre-screening.

**Typical Lite fields:** first name (+ optional initial), age or age range, **1 main photo**, **≤3 short tags**, **1 talk hook / prompt**, **event intention** badge (e.g. open to dating / meet people / see what happens), optional small badges (language, rough area — not exact address).

**Hide:** full gallery, long bio, job/company, social links, deep filters.

### Social — during the event

This doc’s **conversation engine** = the Social layer. Unlocks can still be tied to **QR / game cohort / milestones** where product policy requires.

### Full — after the event

Match decision, trust, recap, deeper fields — **after** shared real-life context.

---

## Six content blocks (data model angle)

Still useful for backend/schema thinking:

- **A. Identity** — top card, minimal during event  
- **B. Vibe** — energy / mood / tags  
- **C. Conversation** — talk hooks, prompts, icebreaker inputs  
- **D. Compatibility** — **mostly post-event**; keep light if shown at all during event  
- **E. Event** — interaction status, game context, recap  
- **F. Safety / trust** — verification, report/block, visibility per phase  

---

## Recommended visibility model (summary)

| Phase | Visible (high level) | Hidden / deferred |
|-------|------------------------|-------------------|
| **Before** | Name, age, 1 photo, few tags, 1 hook, light intention | Full bio, job, gallery, deep prefs, social links |
| **During** | Talk hooks, vibe state, intent, icebreaker card, interaction + game layers, minimal identity | Full bio, job, height, dealbreakers, likes-as-judgment, social proof that enables silent ranking |
| **After** | Full profile, compatibility, recap, like/match flow | Per privacy settings |

---

## Visual direction

**Not** Tinder or LinkedIn. **Card-based**, warm, **action-first** copy and layout — big talk hook, not dense résumé blocks.

---

## What to avoid (product)

- Superficial **ranking** before the event  
- During-event **info dumps** or **LinkedIn energy**  
- Anything that makes the event feel like “swipe night”  

---

## V1 profile spec (ship first)

**Before:** Photo, name, **1 talk hook**, **2 tags**, light intention — curiosity only.

**During:** Prominent **talk hook(s)** + **vibe/status** + **event intent** + **one auto icebreaker** + **interaction status** when applicable + **game layer** when a game is active + **minimal** identity (1–2 photos, ≤3 tags). No full bio / job / height / dealbreakers on the during-event surface.

**After:** Full gallery, bio, lifestyle / compatibility, **interaction recap**, mutual like → chat.

---

## Related docs

- [Core product concept](../../.cursor/rules/core-product-concept.mdc) — Meet → Interact → Then Match  
- [BLUEPRINT.md](../BLUEPRINT.md) — QR, soft match, anonymity  
- [Profile flow](./profile-flow.md) — current implementation (single static profile today; migrate toward this spec)
