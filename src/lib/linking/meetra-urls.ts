import * as Linking from 'expo-linking';

/**
 * Universal invite link — resolves to `meetra://join?code=…` in production builds
 * and Expo dev URLs in development (still parseable by `parseMeetraPayload`).
 */
export function buildInviteJoinUrl(inviteCode: string): string {
  return Linking.createURL('join', { queryParams: { code: inviteCode } });
}

/** Check-in QR / link payload (global scanner + venue print). */
export function buildCheckInUrl(checkInCode: string): string {
  return Linking.createURL('checkin', { queryParams: { code: checkInCode } });
}
