/**
 * AI-assisted vibe + hook synthesis. Uses OpenAI when EXPO_PUBLIC_OPENAI_API_KEY is set;
 * otherwise deterministic copy from user-provided signals only (no invented facts).
 */

import type { DatingProfile } from '@/lib/firestore/profiles';

export type VibeSynthesisResult = {
  aiVibeSummary: string;
  aiStandoutHook: string;
  aiSuggestedAskMe: string;
};

function trimSentence(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

/** Local synthesis — only uses fields the user entered. */
export function synthesizeVibeLocal(profile: DatingProfile): VibeSynthesisResult {
  const tags = profile.vibeTags.filter(Boolean).slice(0, 3);
  const energy = profile.socialEnergy.trim();
  const styles = profile.interactionStyle.slice(0, 4);
  const interestBits = profile.interests.slice(0, 2);

  const summaryParts: string[] = [];
  if (tags.length) summaryParts.push(tags.join(' · '));
  if (energy) {
    const label =
      energy === 'introvert'
        ? 'Thoughtful energy'
        : energy === 'extrovert'
          ? 'Outgoing energy'
          : energy === 'ambivert'
            ? 'Balanced social energy'
            : energy === 'depends'
              ? 'Adapts to the room'
              : energy;
    summaryParts.push(label);
  }
  if (styles.includes('deep_over_smalltalk')) summaryParts.push('here for real conversation');
  if (styles.includes('playful')) summaryParts.push('playful streak');
  if (styles.includes('chill')) summaryParts.push('easy-going');
  if (!summaryParts.length && interestBits.length) {
    summaryParts.push(`Into ${interestBits.join(' & ')}`);
  }

  const aiVibeSummary = trimSentence(
    summaryParts.length ? summaryParts.join(' — ') : 'Warm, approachable, and here to connect in person.',
    160
  );

  const friends = profile.conversationHooks.friendsWouldSay.trim();
  const excited = profile.conversationHooks.excitedWhen.trim();
  const talkForever = profile.conversationHooks.talkForeverAbout.trim();
  const ask = profile.conversationHooks.askMeAbout.trim();

  let aiStandoutHook = '';
  if (friends) {
    aiStandoutHook = trimSentence(`Friends might say: ${friends}`, 140);
  } else if (excited) {
    aiStandoutHook = trimSentence(`Lights up when talking about: ${excited}`, 140);
  } else if (talkForever) {
    aiStandoutHook = trimSentence(`Could talk for hours about: ${talkForever}`, 140);
  } else if (tags[0]) {
    aiStandoutHook = trimSentence(`${tags[0]} — say hi and see where the conversation goes.`, 140);
  } else {
    aiStandoutHook = 'Say hi — easy conversation, low pressure.';
  }

  let aiSuggestedAskMe = '';
  if (!ask && interestBits[0]) {
    aiSuggestedAskMe = trimSentence(`Ask me about ${interestBits[0].toLowerCase()}`, 120);
  } else if (!ask && talkForever) {
    aiSuggestedAskMe = trimSentence(`Ask me about ${talkForever.slice(0, 40)}${talkForever.length > 40 ? '…' : ''}`, 120);
  }

  return { aiVibeSummary, aiStandoutHook, aiSuggestedAskMe };
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function synthesizeVibe(profile: DatingProfile): Promise<VibeSynthesisResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    return synthesizeVibeLocal(profile);
  }

  const facts = {
    displayName: profile.displayName,
    vibeTags: profile.vibeTags,
    socialEnergy: profile.socialEnergy,
    interactionStyle: profile.interactionStyle,
    interests: profile.interests,
    lifestyleSignals: profile.lifestyleSignals,
    hooks: profile.conversationHooks,
    eventIntention: profile.eventIntention,
  };

  const system = `You help people show up well at in-person singles events. Output supportive, grounded copy — never cringe, never claim fate or certainty about romance. Avoid "perfect match", "soulmate", "meant to be", or any deterministic pairing language. Use soft, probabilistic phrasing ("might", "tends to", "likely"). Only use facts present in the user JSON; never invent demographics, jobs, relationships, or stories. Return JSON only with keys: aiVibeSummary (short, max ~120 chars), aiStandoutHook (one memorable line, max ~140 chars), aiSuggestedAskMe (optional, max ~100 chars, empty string if hooks already have ask me about).`;

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          {
            role: 'user',
            content: `Generate profile helper lines from this JSON:\n${JSON.stringify(facts)}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return synthesizeVibeLocal(profile);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return synthesizeVibeLocal(profile);

    const parsed = JSON.parse(raw) as Partial<VibeSynthesisResult>;
    const aiVibeSummary =
      typeof parsed.aiVibeSummary === 'string' && parsed.aiVibeSummary.trim()
        ? trimSentence(parsed.aiVibeSummary, 160)
        : synthesizeVibeLocal(profile).aiVibeSummary;
    const aiStandoutHook =
      typeof parsed.aiStandoutHook === 'string' && parsed.aiStandoutHook.trim()
        ? trimSentence(parsed.aiStandoutHook, 160)
        : synthesizeVibeLocal(profile).aiStandoutHook;
    const aiSuggestedAskMe =
      typeof parsed.aiSuggestedAskMe === 'string' ? trimSentence(parsed.aiSuggestedAskMe, 120) : '';

    return { aiVibeSummary, aiStandoutHook, aiSuggestedAskMe };
  } catch {
    return synthesizeVibeLocal(profile);
  }
}
