import Link from 'next/link';

import { SmartImage } from '@/components/shared/smart-image';
import { SocialLinks } from '@/components/shared/social-links';
import { TagList } from '@/components/ui/badge';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { cn } from '@/lib/utils/cn';
import { monogram } from '@/lib/utils/format';
import type { TeamMember } from '@/types/api';

/** Letter avatar on the brand gradient, used when there is no photo. */
export function Monogram({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // White text stays above 5:1 on both ends of the gradient.
        'flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-strong to-indigo-600 font-bold text-white',
        className,
      )}
    >
      {monogram(name)}
    </span>
  );
}

const avatarSizes = {
  sm: { pixels: 40, className: 'size-10', text: 'text-sm' },
  md: { pixels: 64, className: 'size-16', text: 'text-xl' },
  lg: { pixels: 96, className: 'size-24', text: 'text-3xl' },
};

export function MemberAvatar({
  member,
  size = 'md',
}: {
  member: Pick<TeamMember, 'name' | 'avatarUrl'>;
  size?: keyof typeof avatarSizes;
}) {
  const { pixels, className, text } = avatarSizes[size];

  return (
    // A thin gradient ring around every avatar.
    <span className="shrink-0 rounded-full bg-brand p-0.5">
      <span className="block rounded-full bg-surface p-0.5">
        {member.avatarUrl ? (
          <SmartImage
            src={member.avatarUrl}
            alt=""
            width={pixels}
            height={pixels}
            className={cn(className, 'rounded-full object-cover')}
          />
        ) : (
          <Monogram name={member.name} className={cn(className, text)} />
        )}
      </span>
    </span>
  );
}

/** Compact card used on the homepage; links to the member's profile. */
export function TeamMemberPreview({ member, href }: { member: TeamMember; href: string }) {
  return (
    <article className="group reveal relative flex card-interactive flex-col items-center card p-6 text-center">
      <MemberAvatar member={member} />
      <h3 className="mt-4 font-bold">
        {/* Stretched link: the whole card is clickable, the accessible name stays the member's name. */}
        <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
          {member.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted" dir="auto">
        {member.role}
      </p>
      {member.specialization ? (
        <p className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-aqua" dir="auto">
          {member.specialization}
        </p>
      ) : null}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-aqua group-has-[a:focus-visible]:ring-2"
      />
    </article>
  );
}

/** Full profile used on the team page. */
export function TeamMemberProfile({ member, locale, dict }: { member: TeamMember; locale: Locale; dict: Dictionary }) {
  return (
    <article id={member.slug} className="reveal flex scroll-mt-28 flex-col card p-6 sm:p-7">
      <div className="flex items-center gap-5">
        <MemberAvatar member={member} size="lg" />
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{member.name}</h2>
          <p className="text-muted" dir="auto">
            {member.role}
          </p>
          {member.specialization ? (
            <p
              className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-aqua"
              dir="auto"
            >
              {member.specialization}
            </p>
          ) : null}
        </div>
      </div>

      {member.bio ? <p className="mt-5 leading-8 whitespace-pre-line text-body">{member.bio}</p> : null}

      {member.skills.length ? (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-bold">{dict.team.skills}</h3>
          <TagList items={member.skills} />
        </div>
      ) : null}

      {member.projects.length ? (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-bold">{dict.team.projects}</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {member.projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={localizePath(`/projects/${project.slug}`, locale)}
                  className="text-primary-bright transition-colors hover:text-aqua hover:underline"
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SocialLinks
        links={member.socialLinks}
        labels={dict.social}
        newTabLabel={dict.common.opensInNewTab}
        owner={member.name}
        className="mt-auto pt-6"
      />
    </article>
  );
}
