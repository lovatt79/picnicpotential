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
 *
 * "2026-05-22" → "May 22, 2026"
 */
export function formatDateStr(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr; // fallback: return as-is
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return dateStr;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/**
 * Convert a 24-hour time string (HH:MM) to 12-hour with AM/PM.
 * This is what <input type="time"> always produces.
 *
 * "14:30" → "2:30 PM"
 * "09:00" → "9:00 AM"
 * "00:00" → "12:00 AM"
 * "12:00" → "12:00 PM"
 */
export function formatTimeStr(timeStr: string | null | undefined): string | null {
  if (!timeStr) return null;
  const [hourStr, minuteStr] = timeStr.split(":");
  if (!hourStr || !minuteStr) return timeStr; // fallback: return as-is
  const hour = parseInt(hourStr, 10);
  if (isNaN(hour)) return timeStr;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${period}`;
}
