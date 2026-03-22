/**
 * Central query key factory for TanStack Query.
 * Use these keys for all queries and mutations so invalidation stays consistent.
 */

export const queryKeys = {
  profile: (uid: string) => ['profile', uid] as const,
  profiles: () => ['profiles'] as const,
  activeEventMembership: (uid: string) => ['event-membership', uid] as const,
  event: (eventId: string) => ['event', eventId] as const,
} as const;
