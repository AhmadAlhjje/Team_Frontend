import { BrandMark } from '@/components/brand/brand-mark';
import { ArrowForwardIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';

interface CtaSectionProps {
  title: string;
  subtitle: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}

/** Closing call-to-action shown at the end of most pages. */
export function CtaSection({ title, subtitle, primary, secondary }: CtaSectionProps) {
  return (
    <section aria-labelledby="cta-title" className="py-16 sm:py-20">
      <Container>
        {/* 1px gradient frame around the card. */}
        <div className="reveal rounded-3xl bg-linear-to-br from-aqua/50 via-line to-iris/50 p-px shadow-[0_40px_120px_-60px_rgb(59_130_246/0.6)]">
          <div className="relative isolate overflow-hidden rounded-[calc(1.5rem-1px)] bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-aurora" />
              <div className="absolute inset-0 bg-grid" />
              <BrandMark className="absolute -top-10 -inset-s-10 size-56 rotate-12 opacity-10" />
            </div>
            <div className="mx-auto max-w-2xl">
              <h2 id="cta-title" className="text-2xl font-bold sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base leading-8 text-body sm:text-lg">{subtitle}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href={primary.href} size="lg">
                  {primary.label}
                  <ArrowForwardIcon />
                </ButtonLink>
                {secondary ? (
                  <ButtonLink href={secondary.href} size="lg" variant="secondary">
                    {secondary.label}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
