export interface TextSegment {
  text: string;
  highlight: boolean;
}

const HIGHLIGHT = /\*([^*]+)\*/g;

/**
 * Splits admin-authored text where words wrapped in asterisks are highlighted
 * with the brand gradient: "نبني منتجات *متينة*". Unmatched asterisks stay as
 * plain text, so a typo never hides content.
 */
export function splitHighlights(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(HIGHLIGHT)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index), highlight: false });
    segments.push({ text: match[1], highlight: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), highlight: false });
  return segments;
}

/** The same text without highlight markers (for comparisons and plain-text contexts). */
export function stripHighlights(text: string): string {
  return text.replace(HIGHLIGHT, '$1');
}
