/**
 * Compressed general-onboarding options: selection-first, structured for
 * progressive profile + Mystery Match clue pools (hint-safe, no physical IDs).
 */

export const ONBOARDING_STEPS = 5 as const;

/** Single-select social energy (Step 2). */
export const SOCIAL_ENERGY_OPTIONS = [
  { id: 'introvert', label: 'Mostly introvert' },
  { id: 'ambivert', label: 'Ambivert' },
  { id: 'extrovert', label: 'Mostly extrovert' },
  { id: 'depends', label: 'Depends on the room' },
] as const;

export type SocialEnergyId = (typeof SOCIAL_ENERGY_OPTIONS)[number]['id'];

/**
 * Multi-select “vibe & interaction” chips — each maps into vibe tags + interaction style + clue texture.
 */
export const VIBE_INTERACTION_CHIPS: Array<{
  id: string;
  label: string;
  mapsTo: { vibeTag: string; interactionStyle: string; lifestyleHint?: string };
}> = [
  {
    id: 'deep-not-small',
    label: 'Deep conversations > small talk',
    mapsTo: { vibeTag: 'Deep talker', interactionStyle: 'deep_over_smalltalk' },
  },
  {
    id: 'playful-chaotic',
    label: 'Playful / a little chaotic',
    mapsTo: { vibeTag: 'Playful', interactionStyle: 'playful' },
  },
  {
    id: 'chill-flow',
    label: 'Chill / go with the flow',
    mapsTo: { vibeTag: 'Low-drama', interactionStyle: 'chill' },
  },
  {
    id: 'shy-first',
    label: 'Shy at first, then opens up',
    mapsTo: { vibeTag: 'Thoughtful', interactionStyle: 'slow_warmup' },
  },
  {
    id: 'instant-spark',
    label: 'Instant spark energy',
    mapsTo: { vibeTag: 'Confident', interactionStyle: 'instant_spark' },
  },
  {
    id: 'one-on-one',
    label: '1:1 energy',
    mapsTo: { vibeTag: 'Kind energy', interactionStyle: 'one_on_one' },
  },
  {
    id: 'group-energy',
    label: 'Group energy',
    mapsTo: { vibeTag: 'Outgoing', interactionStyle: 'group_energy' },
  },
  {
    id: 'playful-not-deep',
    label: 'Playful more than serious',
    mapsTo: { vibeTag: 'Playful', interactionStyle: 'playful_over_deep' },
  },
  {
    id: 'grounded',
    label: 'Grounded / steady',
    mapsTo: { vibeTag: 'Honest & direct', interactionStyle: 'grounded' },
  },
];

/** Interest chips (Step 4) — feeds interests + hint-safe topics. */
export const ONBOARDING_INTEREST_OPTIONS = [
  'Travel',
  'Fitness',
  'Startups',
  'Music',
  'Cooking',
  'Reading',
  'Outdoors',
  'Nightlife',
  'Art',
  'Films',
  'Tech',
  'Games',
  'Photography',
  'Wellness',
  'Food & dining',
  'Food',
  'Sports',
  'Movies',
  'Gaming',
] as const;

/** Lifestyle / identity texture (Step 4). */
export const LIFESTYLE_SIGNAL_OPTIONS = [
  'Early bird',
  'Night owl',
  'Cozy nights in',
  'Spontaneous',
  'Competitive (friendly)',
  'Grounded',
  'Adventurous',
  'Planner',
] as const;

/**
 * Clue classes for participation defaults + Mystery Match (no physical / sensitive classes).
 * IDs are stable for Firestore + future Cloud Functions.
 */
export const CLUE_CLASS_OPTIONS = [
  { id: 'interests', label: 'Interests & hobbies' },
  { id: 'vibe', label: 'Vibe & energy' },
  { id: 'conversation_hooks', label: 'Conversation hooks' },
  { id: 'playful_traits', label: 'Playful traits' },
  { id: 'social_energy', label: 'Social energy' },
  { id: 'lifestyle', label: 'Lifestyle & rhythm' },
] as const;

export type ClueClassId = (typeof CLUE_CLASS_OPTIONS)[number]['id'];

export const DEFAULT_ALLOWED_CLUE_TYPES: ClueClassId[] = [
  'interests',
  'vibe',
  'conversation_hooks',
  'playful_traits',
  'social_energy',
  'lifestyle',
];
