import {
  primaryTalkHook,
  type DatingProfile,
  type ProfileLayer,
  type ProfilePhoto,
  type ProfilePromptAnswer,
} from '@/lib/firestore/profiles';

export type ProfileLayerView = {
  photos: ProfilePhoto[];
  vibeTags: string[];
  eventIntention: string;
  prompts: ProfilePromptAnswer[];
  talkAbout: string;
  interests: string[];
  bio: string;
  aiVibeSummary: string;
  aiStandoutHook: string;
  aiSuggestedAskMe: string;
  lifestyleSignals: string[];
  socialEnergy: string;
};

/**
 * Trims profile content to what should be visible for a given phase.
 * Client-side mapper; server-side rules can mirror later.
 */
export function profileForLayer(profile: DatingProfile, layer: ProfileLayer): ProfileLayerView {
  const hook = primaryTalkHook(profile);

  if (layer === 'lite') {
    return {
      photos: profile.photos.slice(0, 1),
      vibeTags: profile.vibeTags.slice(0, 3),
      eventIntention: profile.eventIntention,
      prompts: profile.prompts.slice(0, 1),
      talkAbout: hook,
      interests: [],
      bio: '',
      aiVibeSummary: profile.aiVibeSummary.trim(),
      aiStandoutHook: '',
      aiSuggestedAskMe: profile.aiSuggestedAskMe.trim(),
      lifestyleSignals: [],
      socialEnergy: '',
    };
  }

  if (layer === 'social') {
    return {
      photos: profile.photos.slice(0, 2),
      vibeTags: profile.vibeTags.slice(0, 3),
      eventIntention: profile.eventIntention,
      prompts: profile.prompts.slice(0, 2),
      talkAbout: hook,
      interests: profile.interests.slice(0, 5),
      bio: '',
      aiVibeSummary: profile.aiVibeSummary.trim(),
      aiStandoutHook: profile.aiStandoutHook.trim(),
      aiSuggestedAskMe: profile.aiSuggestedAskMe.trim(),
      lifestyleSignals: profile.lifestyleSignals.slice(0, 4),
      socialEnergy: profile.socialEnergy,
    };
  }

  return {
    photos: profile.photos,
    vibeTags: profile.vibeTags.slice(0, 3),
    eventIntention: profile.eventIntention,
    prompts: profile.prompts,
    talkAbout: hook,
    interests: profile.interests,
    bio: profile.bio,
    aiVibeSummary: profile.aiVibeSummary.trim(),
    aiStandoutHook: profile.aiStandoutHook.trim(),
    aiSuggestedAskMe: profile.aiSuggestedAskMe.trim(),
    lifestyleSignals: profile.lifestyleSignals,
    socialEnergy: profile.socialEnergy,
  };
}
