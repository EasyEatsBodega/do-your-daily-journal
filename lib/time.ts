/**
 * Timezone helpers for computing user-local dates and times
 */

export function getZonedParts(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? "";

  return {
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

/**
 * Get today's date (YYYY-MM-DD) in the user's timezone.
 * After midnight (12:00 AM) local time, this will return the next calendar day.
 * Example: At 12:01 AM on Jan 5th in user's timezone → returns "2026-01-05"
 */
export function getTodayYmd(timeZone: string): string {
  return getZonedParts(new Date(), timeZone).ymd;
}

export function nextDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function formatDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

