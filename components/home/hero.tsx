import { ArrowForwardIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { splitHighlights } from '@/lib/utils/highlight';

import { HeroArt } from './hero-art';

interface HeroProps {
  eyebrow: string | null;
  /** Words wrapped in *asterisks* are highlighted with the brand gradient. */
  title: string;
  subtitle: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

/**
 * First screen: who we are, what we do, what we can do for the visitor.
 * The h1 is the LCP element: plain text, never animated, rendered instantly.
 */
export function Hero({ eyebrow, title, subtitle, primary, secondary }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <Container className="grid items-center gap-12 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:grid-cols-[1.2fr_1fr] lg:pt-28 lg:pb-32">
        <div>
          {eyebrow ? (
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-sm text-body backdrop-blur">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-aqua motion-safe:animate-ping-soft" />
                <span className="relative inline-flex size-2 rounded-full bg-aqua" />
              </span>
              {eyebrow}
            </p>
          ) : null}
          <h1 id="hero-title" className="text-4xl leading-[1.3] font-bold sm:text-5xl lg:text-6xl lg:leading-tight">
            {splitHighlights(title).map((segment, index) =>
              segment.highlight ? (
                <span key={index} className="text-gradient">
                  {segment.text}
                </span>
              ) : (
                segment.text
              ),
            )}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-body sm:text-xl sm:leading-9">{subtitle}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
              <ArrowForwardIcon />
            </ButtonLink>
            <ButtonLink href={secondary.href} size="lg" variant="secondary">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>

        <HeroArt className="hidden lg:block" />
      </Container>
    </section>
  );
}
