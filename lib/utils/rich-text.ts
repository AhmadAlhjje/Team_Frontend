/**
 * Plain-text content from Admin is rendered with a tiny, safe formatter:
 * - blank lines separate paragraphs
 * - consecutive lines starting with "-", "*" or "•" become a list, also right
 *   after an introductory line ("الحل:\n- نقطة\n- نقطة")
 *
 * No HTML is ever interpreted, so admin content cannot inject markup.
 */
export type RichTextBlock = { type: 'paragraph'; text: string } | { type: 'list'; items: string[] };

const BULLET = /^\s*[-*•]\s+/;

export function parseRichText(input: string | null | undefined): RichTextBlock[] {
  if (!input) return [];

  const blocks: RichTextBlock[] = [];
  for (const chunk of input.replace(/\r\n?/g, '\n').split(/\n\s*\n/)) {
    let paragraph: string[] = [];
    let items: string[] = [];

    for (const line of chunk.split('\n').map((value) => value.trim())) {
      if (!line) continue;
      if (BULLET.test(line)) {
        if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
        paragraph = [];
        items.push(line.replace(BULLET, ''));
      } else {
        if (items.length) blocks.push({ type: 'list', items });
        items = [];
        paragraph.push(line);
      }
    }

    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
    if (items.length) blocks.push({ type: 'list', items });
  }
  return blocks;
}

/** Collapses text into a single line and truncates it for meta descriptions. */
export function toPlainExcerpt(input: string | null | undefined, maxLength = 160): string {
  if (!input) return '';
  const text = input.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
