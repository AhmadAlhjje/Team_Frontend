import { cn } from '@/lib/utils/cn';
import { parseRichText } from '@/lib/utils/rich-text';

/** Renders admin-authored plain text as paragraphs and lists (never as HTML). */
export function RichText({ text, className }: { text: string | null | undefined; className?: string }) {
  const blocks = parseRichText(text);
  if (blocks.length === 0) return null;

  return (
    <div className={cn('space-y-4 text-base leading-8 text-body sm:text-lg sm:leading-9', className)}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={index} className="space-y-2.5">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rotate-45 bg-aqua" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={index} className="whitespace-pre-line">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}
