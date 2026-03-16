/**
 * Central query key factory for TanStack Query.
 * Use these keys for all queries and mutations so invalidation stays consistent.
 */

export const queryKeys = {
  profile: (uid: string) => ['profile', uid] as const,
  profiles: () => ['profiles'] as const,
} as const;
