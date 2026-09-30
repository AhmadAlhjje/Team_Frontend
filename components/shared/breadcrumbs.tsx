import Link from 'next/link';

import { breadcrumbSchema, type BreadcrumbItem, jsonLdGraph } from '@/lib/seo/json-ld';

import { JsonLd } from './json-ld';

/** Visible breadcrumb trail + matching BreadcrumbList structured data. */
export function Breadcrumbs({ items, label }: { items: BreadcrumbItem[]; label: string }) {
  return (
    <>
      <nav aria-label={label} className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="transition-colors hover:text-ink">
                      {item.name}
                    </Link>
                    <span aria-hidden="true" className="text-line-strong">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={jsonLdGraph(breadcrumbSchema(items))} />
    </>
  );
}
