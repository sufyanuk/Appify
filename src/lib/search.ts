/** Lower-case and strip accents so "Sol kadhi", "solkadhi" and "SOLKADHI" behave alike. */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * True when every word of `query` appears somewhere in `fields`.
 * Spaces are ignored inside the haystack too, so "vadapav" finds "Vada Pav".
 */
export function matchesSearch(query: string, fields: (string | null | undefined)[]): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(fields.filter(Boolean).join(" "));
  const compact = haystack.replace(/\s+/g, "");
  return words.every((w) => haystack.includes(w) || compact.includes(w));
}
