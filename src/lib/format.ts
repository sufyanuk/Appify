// Formatting for customers in Qatar: Qatari riyals and Qatar time (AST, UTC+3).
const wholeRiyals = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "QAR",
  currencyDisplay: "code",
  maximumFractionDigits: 0,
});
const riyalsAndDirhams = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "QAR",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
});

/**
 * Prices are stored as integer dirhams (1 QAR = 100 dirhams).
 * 3500 → "QAR 35", 1250 → "QAR 12.50".
 */
export function formatPrice(dirhams: number): string {
  return (dirhams % 100 === 0 ? wholeRiyals : riyalsAndDirhams)
    .format(dirhams / 100)
    .replace(/\u00a0/g, " ");
}

/** Dirhams → "35" or "12.50" for editing in a form input. */
export function centsToInput(dirhams: number): string {
  return dirhams % 100 === 0 ? String(dirhams / 100) : (dirhams / 100).toFixed(2);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Qatar",
  }).format(date);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Split a newline separated text block into trimmed, non-empty lines. */
export function toLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
