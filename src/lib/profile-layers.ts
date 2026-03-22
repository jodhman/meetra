import type { DatingProfile, ProfileLayer, ProfilePhoto, ProfilePromptAnswer } from '@/lib/firestore/profiles';

export type ProfileLayerView = {
  photos: ProfilePhoto[];
  vibeTags: string[];
  eventIntention: string;
  prompts: ProfilePromptAnswer[];
  talkAbout: string;
  interests: string[];
  bio: string;
};

/**
 * Trims profile content to what should be visible for a given phase.
 * This is a client-side view mapper (actual server-side visibility can come later).
 */
export function profileForLayer(profile: DatingProfile, layer: ProfileLayer): ProfileLayerView {
  if (layer === 'lite') {
    return {
      photos: profile.photos.slice(0, 1),
      vibeTags: profile.vibeTags.slice(0, 3),
      eventIntention: profile.eventIntention,
      prompts: profile.prompts.slice(0, 1),
      talkAbout: '',
      interests: [],
      bio: '',
    };
  }

  if (layer === 'social') {
    return {
      photos: profile.photos.slice(0, 3),
      vibeTags: profile.vibeTags.slice(0, 3),
      eventIntention: profile.eventIntention,
      prompts: profile.prompts.slice(0, 3),
      talkAbout: profile.talkAbout,
      // During-event surface should stay lightweight; limit chips in UI.
      interests: profile.interests.slice(0, 5),
      bio: '',
    };
  }

  return {
    photos: profile.photos,
    vibeTags: profile.vibeTags.slice(0, 3),
    eventIntention: profile.eventIntention,
    prompts: profile.prompts,
    talkAbout: profile.talkAbout,
    interests: profile.interests,
    bio: profile.bio,
  };
}

