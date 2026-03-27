/** Shorten long Firebase UIDs for compact display (e.g. host lists). */
export function formatCompressedUid(uid: string): string {
  if (uid.length <= 10) return uid;
  return `${uid.slice(0, 4)}…${uid.slice(-4)}`;
}
