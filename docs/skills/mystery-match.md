# Mystery Match (V1 first mode)

`Mystery Match` is the first concrete V1 game mode.

It is a **playful in-room discovery mode**: Meetra assigns each participating attendee one hidden, AI-selected **promising connection** for the round.

Framing:
- Not a soulmate claim
- Not deterministic perfect-match language
- Not classic blind-date pairing
- Yes to: likely fit, strong conversation fit, someone you may enjoy meeting

The goal is to reduce approach anxiety and turn open-floor mingling into guided discovery while preserving safety and low embarrassment.

---

## 1) Mode loop (attendee)

1. Join event + complete required onboarding.
2. Opt into Mystery Match (if enabled by host).
3. Receive one hidden assignment for the round.
4. Get an initial clue.
5. Mingle broadly; unlock extra hints over time/milestones.
6. Receive soft proximity cues when nearby.
7. Attempt identify + meet in person.
8. Reveal/confirmation happens after an intentional trigger.
9. If confirmed or interacted, candidate is prioritized in post-event soft match/like flow.
10. At any point (before or after reveal), user can use the exit hatch to stop participating in the current assignment.

Design intent:
- Increase movement, circulation, and interactions.
- Avoid tunnel vision where users ignore everyone except one target.
- Keep participation voluntary and non-coercive through a private, low-friction exit hatch.

---

## 2) Hint system

Hints should be progressive, conversation-first, and sourced mainly from the **during-event Social profile layer**.

Good hint categories:
- Interests
- Vibe clues
- Playful trait clues
- Social-energy clues
- Conversation hooks / "ask them about..." cues
- Light situational/personality cues

Example directions:
- "prefers outdoors over brunch"
- "loves deep conversations"
- "unexpectedly competitive"
- "ask them about a hobby they can do for hours"
- "calm but witty energy"
- "here hoping to meet someone playful / grounded / thoughtful"

Avoid:
- Exact physical identifiers
- Premature identity reveal
- Sensitive or overly specific personal facts
- Demographic spotting mechanics

Principle:
- Hints exist to start real conversations, not to expose identity too early.

---

## 3) Proximity and haptics

Desired feeling: warm tension/discovery, not exact tracking.

Guidance:
- Use broad proximity tiers (e.g. `no signal`, `warmer`, `close`, `very close`)
- Optional subtle haptics that intensify by tier
- No exact radar map
- No directional arrow to a person
- No precise live attendee location reveal

Reality constraint:
- Do not assume precise indoor GPS person-finding.
- Frame V1 around soft, approximate proximity behavior.

Safety/usability guardrails:
- Subtle, non-constant signals
- Avoid battery-heavy behavior
- Avoid creepy/stalker-like UX

---

## 4) Reveal and confirmation

Reveal should be delayed and intentional, not immediate at assignment.

Possible triggers:
- Sustained close-proximity threshold
- QR scan between both attendees
- Both users confirm "I think I found my match"
- Lightweight verification prompt
- Host/game milestone unlock

Principle:
- Reveal should feel earned and playful without becoming frustratingly opaque.
- Users must still be able to disengage at this stage via exit hatch (no forced continuation).

Fallbacks if no successful identify:
- End-of-round reveal
- Secondary hint unlock
- Carry forward into post-event soft match flow
- Bonus conversation prompt if they connect later

---

## 5) Exit hatch / opt-out (required safety behavior)

Mystery Match includes an explicit exit hatch so attendees can stop participating in an assigned connection at any point, before or after reveal, without needing to explain themselves.

Exit hatch standards:
- Private
- Easy to access
- Socially low-pressure
- Non-punitive
- Safety-oriented

Before reveal:
- User can leave current assignment without explanation
- Hint/proximity guidance for that assignment stops immediately
- User is not forced to continue searching

After reveal:
- User can disengage without forced continued interaction
- Mode must not imply continued mutual interest
- Exiting must never auto-create a confirmed match

Possible actions:
- `stop this match`
- `skip this match`
- `leave this round`
- `reassign later` / `no current assignment`
- `continue event without Mystery Match`
- `hide me from this mode for rest of event`
- `pause discoverability`

State handling:
- Exiting before reveal ends assignment + guidance loop.
- Exiting after reveal ends mode-level participation for that connection.
- Exit hatch does not replace report/block/safety tooling; reporting remains available separately.

---

## 6) Relationship to post-event matching

Mystery Match is a during-event interaction layer and does not replace match logic.

- **Soft match** = potential/suggestive signal
- **Match** = confirmed mutual like, chat unlocked (post-event only)

Mystery Match can increase visibility/prominence of one candidate in recap/like flow, but confirmed matching still follows normal post-event mutual-like rules.

---

## 7) Onboarding dependency

Mystery Match should use mostly existing general-onboarding/profile data.
Only light event-level setup should be required.

Recommended light event setup:
- Participate tonight?
- Open to being discoverable?
- Tonight preference (romantic spark / conversation fit / open-minded)
- Tonight energy (gentle / playful / bold / deep)
- Preferred clue classes and excluded clue classes
- Exit/discoverability controls (participate, pause, skip, hide for this event)

---

## Related docs

- [Core product concept](../../.cursor/rules/core-product-concept.mdc)
- [Product blueprint](../BLUEPRINT.md)
- [Onboarding model](./onboarding-model.md)
- [Progressive profile visibility](./progressive-profile.md)
