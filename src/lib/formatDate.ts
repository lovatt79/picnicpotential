const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Safely format a DATE-only string (YYYY-MM-DD) for display.
 *
 * Never pass these strings to `new Date(dateStr)` — JS parses them as UTC
 * midnight, which shifts the displayed date one day back in any UTC-X timezone.
 * This function parses the parts directly to avoid that.
 */
export function formatDateStr(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr; // fallback: return as-is
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return dateStr;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
