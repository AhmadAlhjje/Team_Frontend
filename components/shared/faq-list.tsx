import { PlusIcon } from '@/components/icons';
import type { Faq } from '@/types/api';

/** Accordion built on <details>/<summary>: accessible and zero JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.id}
          className="group overflow-hidden card transition-colors open:border-primary/35 open:bg-raised/60"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-ink transition-colors hover:text-aqua sm:px-6 [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-white/4 text-aqua transition-transform duration-300 group-open:rotate-45">
              <PlusIcon className="size-4" />
            </span>
          </summary>
          <p className="px-5 pb-5 leading-8 whitespace-pre-line text-body sm:px-6">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
