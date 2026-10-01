import { classNames } from '../utils.mjs';
import { SocialLinks } from './icons.jsx';

// The layout of each size of cards, as VitePress' `VPTeamMembers`
const SIZES = {
  small: {
    grid: 'grid-cols-[repeat(auto-fit,minmax(224px,1fr))]',
    widths: ['max-w-[276px]', 'max-w-[calc(276px*2+24px)]', 'max-w-[calc(276px*3+24px*2)]'],
    profile: 'p-8',
    data: 'pt-5',
    avatar: 'size-16',
    name: 'text-base/6',
    links: '-mx-4 -mb-5 pt-2.5',
  },
  medium: {
    grid: 'grid-cols-[repeat(auto-fit,minmax(256px,1fr))] min-[375px]:grid-cols-[repeat(auto-fit,minmax(288px,1fr))]',
    widths: ['max-w-[368px]', 'max-w-[calc(368px*2+24px)]'],
    profile: 'px-8 py-12',
    data: 'pt-6',
    avatar: 'size-32',
    name: 'text-xl/7 tracking-[0.15px]',
    links: '-mx-4 -mb-3 px-3 pt-4',
  },
};

/**
 * Cards for the members of a team, each with their avatar and profiles.
 *
 * @param {{ members: Array<{ name: string, avatar: string, links?: Array<{ icon: string, link: string }> }>, size?: 'small' | 'medium' }} props
 */
export default ({ members, size = 'medium' }) => {
  const layout = SIZES[size];

  return (
    <div class="raw mt-6">
      <div
        class={classNames(
          'mx-auto grid gap-6',
          layout.grid,
          layout.widths[members.length - 1] ?? 'max-w-[1152px]',
        )}
      >
        {members.map(({ name, avatar, links = [] }) => (
          <article key={name} class="flex size-full flex-col gap-0.5 overflow-hidden rounded-xl">
            <div class={classNames('grow bg-bg-soft', layout.profile)}>
              <figure
                class={classNames('relative mx-auto shrink-0 rounded-full shadow-3', layout.avatar)}
              >
                <img
                  class="absolute inset-0 size-full rounded-full object-cover"
                  src={avatar}
                  alt={name}
                />
              </figure>
              <div class={classNames('text-center', layout.data)}>
                <p class={classNames('m-0 font-heading font-semibold text-text-1', layout.name)}>
                  {name}
                </p>
                {links.length > 0 && (
                  <div class={classNames('flex h-14 items-start justify-center', layout.links)}>
                    <SocialLinks
                      links={links.map(({ icon, link }) => ({ icon, label: icon, link }))}
                    />
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
