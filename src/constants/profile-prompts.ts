export const MAX_VIBE_TAGS = 3 as const;
export const MAX_PROFILE_PROMPTS = 5 as const;

export const EVENT_INTENTION_OPTIONS = [
  'Looking to meet new people',
  'Open to dating',
  'Just seeing what happens',
] as const;

export type VibeTagGroup = {
  id: string;
  label: string;
  tags: string[];
};

// Vibe tags universe (fixed list; no custom tags).
export const VIBE_TAG_GROUPS: VibeTagGroup[] = [
  {
    id: 'energy',
    label: 'Energy & vibes',
    tags: [
      'Calm energy',
      'High energy',
      'Playful',
      'Outgoing',
      'Introvert (but talkative)',
      'Thoughtful',
      'Deep talker',
      'Curious mind',
      'Kind energy',
      'Confident',
      'Honest & direct',
      'Low-drama',
      'Romantic',
      'Flirty (but respectful)',
      'Adventurous',
      'Spontaneous',
      'Organized planner',
      'Cozy homebody',
      'Outdoorsy',
      'Culture explorer',
      'Night owl',
      'Early bird',
    ],
  },
];

export type ProfilePrompt = {
  id: string;
  text: string;
};

export type ProfilePromptCategory = {
  id: string;
  label: string;
  prompts: ProfilePrompt[];
};

// Hinge-inspired prompt structure, original wording.
export const PROFILE_PROMPT_CATEGORIES: ProfilePromptCategory[] = [
  {
    id: 'about-me',
    label: 'About me',
    prompts: [
      { id: 'my-rule', text: 'A personal rule of mine is: ' },
      { id: 'small-thing', text: 'The small thing I’m most proud of lately is: ' },
      { id: 'first-impression', text: 'If you meet me for the first time, you’ll notice I’m ' },
      { id: 'i-can-talk', text: 'I can talk for way too long about: ' },
    ],
  },
  {
    id: 'stories',
    label: 'Little stories',
    prompts: [
      { id: 'recent-win', text: 'A recent win (big or small) was: ' },
      { id: 'unsent-text', text: 'A message I wish I sent sooner is: ' },
      { id: 'unexpected', text: 'An unexpected thing I love is: ' },
      { id: 'lesson', text: 'A lesson I learned the hard way: ' },
    ],
  },
  {
    id: 'first-date',
    label: 'First-date ideas',
    prompts: [
      { id: 'lowkey-date', text: 'My ideal first date is low-key and includes: ' },
      { id: 'best-spot', text: 'A spot I’d happily take you to: ' },
      { id: 'rain-plan', text: 'If it’s raining, my plan is: ' },
      { id: 'the-vibe', text: 'The vibe I’m looking for is: ' },
    ],
  },
  {
    id: 'hot-takes',
    label: 'Hot takes (friendly)',
    prompts: [
      { id: 'hill', text: 'I will defend this (politely): ' },
      { id: 'pet-peeve', text: 'A tiny pet peeve that makes me irrationally annoyed: ' },
      { id: 'agree-disagree', text: 'We can debate: ' },
      { id: 'green-flag', text: 'A green flag I notice quickly is: ' },
    ],
  },
  {
    id: 'quirks',
    label: 'Quirks',
    prompts: [
      { id: 'weird-flex', text: 'My weird flex is: ' },
      { id: 'comfort', text: 'My comfort thing lately has been: ' },
      { id: 'oddly-obsessed', text: 'Currently I’m oddly obsessed with: ' },
      { id: 'small-ritual', text: 'A small ritual that makes my day better: ' },
    ],
  },
  {
    id: 'future',
    label: 'The future',
    prompts: [
      { id: 'what-i-want', text: 'Something I want more of this year: ' },
      { id: 'how-to-love', text: 'How I like to be loved is: ' },
      { id: 'perfect-weekend', text: 'Picture my perfect weekend: ' },
      { id: 'teach-me', text: 'Teach me something you’re good at: ' },
    ],
  },
];

export function promptTextById(promptId: string): string | null {
  for (const cat of PROFILE_PROMPT_CATEGORIES) {
    const found = cat.prompts.find((p) => p.id === promptId);
    if (found) return found.text;
  }
  return null;
}

export function allPrompts(): ProfilePrompt[] {
  return PROFILE_PROMPT_CATEGORIES.flatMap((c) => c.prompts);
}

