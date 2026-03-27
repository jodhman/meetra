function normalizeCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

export type MeetraQrV1 =
  | { v: 1; type: 'invite'; code: string; ambiguous?: boolean }
  | { v: 1; type: 'checkin'; code: string }
  | { v: 1; type: 'unknown'; raw: string };

/**
 * Versioned QR / deep-link payload contract (v1).
 * Supported forms:
 * - meetra://join?code=XXXXXX (hostname `join` — common for custom schemes)
 * - meetra://v1/checkin?code=XXXXXX
 * - meetra:///join?code= (path variants)
 * - CHECKIN:XXXXXX  INVITE:XXXXXX
 * - Plain 6-char alphanumeric → treated as invite code
 */
export function parseMeetraPayload(raw: string): MeetraQrV1 {
  const trimmed = raw.trim();
  if (!trimmed) return { v: 1, type: 'unknown', raw };

  try {
    let url: URL;
    if (trimmed.startsWith('meetra://')) {
      url = new URL(trimmed.replace(/^meetra:\/\//, 'https://'));
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      url = new URL(trimmed);
    } else {
      throw new Error('not http url');
    }

    const host = (url.hostname || '').toLowerCase();
    const path = (url.pathname || '').replace(/^\//, '').toLowerCase();
    const code =
      url.searchParams.get('code') ?? url.searchParams.get('invite') ?? url.searchParams.get('c') ?? '';
    const t = (url.searchParams.get('t') ?? '').toLowerCase();

    if (host === 'checkin' || path.includes('checkin') || t === 'checkin') {
      const c = normalizeCode(code);
      if (c) return { v: 1, type: 'checkin', code: c };
    }
    if (host === 'join' || path.includes('join') || path.includes('invite') || t === 'invite') {
      const c = normalizeCode(code);
      if (c) return { v: 1, type: 'invite', code: c };
    }
  } catch {
    // fall through
  }

  const checkinMatch = /^CHECKIN[:\s]+([A-Z0-9]+)$/i.exec(trimmed);
  if (checkinMatch?.[1]) {
    return { v: 1, type: 'checkin', code: normalizeCode(checkinMatch[1]) };
  }
  const inviteMatch = /^INVITE[:\s]+([A-Z0-9]+)$/i.exec(trimmed);
  if (inviteMatch?.[1]) {
    return { v: 1, type: 'invite', code: normalizeCode(inviteMatch[1]) };
  }

  if (/^[A-Z0-9]{6}$/i.test(trimmed)) {
    return { v: 1, type: 'invite', code: normalizeCode(trimmed), ambiguous: true };
  }

  return { v: 1, type: 'unknown', raw: trimmed };
}
