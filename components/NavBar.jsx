import SearchBox from '@doc-kit/generator-react/html/ui/components/SearchBox/index.jsx';

import { classNames, isCurrent, isExternal, pageURL } from '../utils.mjs';
import ThemeToggle from './ThemeToggle.jsx';
import { ArrowUpRight, ChevronDown, Close, MoreHorizontal, SocialLinks } from './icons.jsx';

/**
 * Whether a navigation item belongs to the section of the current page.
 */
const isActive = ({ link, activeMatch }, path) =>
  activeMatch
    ? new RegExp(activeMatch).test(pageURL(path))
    : Boolean(link && isCurrent(link, path));

const external = (link) => (isExternal(link) ? { target: '_blank', rel: 'noreferrer' } : {});

const color = (active) => (active ? 'text-brand' : 'text-primary dark:text-white');

/**
 * The site header: logo, navigation, search, appearance and social links.
 *
 * On narrow screens the navigation is a full-screen panel, opened and closed
 * by the labels of the `#nav-open` checkbox, and its menus expand in place
 * with checkboxes of their own; on wide ones, it sits in the header, and its
 * menus open on hover. No JavaScript is involved.
 *
 * @param {object} props
 * @param {import('@doc-kit/generator-react/html/ui/types').SerializedMetadata} props.metadata
 * @param {Array<{ text: string, link?: string, activeMatch?: string, items?: Array<{ text: string, link: string }> }>} props.nav The navigation, in VitePress' `nav` shape
 * @param {Array<{ icon: string, label: string, link: string }>} props.socialLinks
 * @param {{ light: string, dark: string, alt: string }} props.logo The logo for each color scheme
 */
export default ({ metadata, nav, socialLinks, logo }) => {
  const forcedTheme = Boolean(metadata.theme);

  return (
    <div
      class={classNames(
        'relative z-50 w-full',
        metadata.layout !== 'home' && 'lg:fixed lg:inset-x-0 lg:top-0',
      )}
    >
      <header class="group/header wrapper relative flex items-center justify-between border-b border-stroke bg-white px-6 py-5 dark:border-nickel dark:bg-primary">
        <input type="checkbox" id="nav-open" class="hidden" aria-hidden="true" />

        <div class="flex gap-10 self-stretch">
          <a
            href="/"
            class="-mx-2 flex flex-col items-start justify-center px-2"
            aria-label={logo.alt}
          >
            <img class="block h-4 dark:hidden" src={logo.light} alt={logo.alt} />
            <img class="hidden h-4 dark:block" src={logo.dark} alt={logo.alt} />
          </a>

          <nav
            class="fixed inset-0 z-1001 hidden flex-col overflow-y-auto bg-bg px-5 pt-20 pb-12 group-has-[#nav-open:checked]/header:flex lg:static lg:z-auto lg:flex lg:flex-row lg:items-center lg:overflow-visible lg:bg-transparent lg:p-0"
            aria-label="Main Navigation"
          >
            <label
              for="nav-open"
              class="absolute top-5 right-5 cursor-pointer p-2 transition-opacity hover:opacity-70 lg:hidden"
              aria-label="Close navigation menu"
            >
              <Close class="size-6" />
            </label>

            {nav.map((entry) =>
              entry.items ? (
                <div
                  key={entry.text}
                  class="group relative flex flex-col lg:flex-row lg:items-center"
                >
                  <input type="checkbox" id={`nav-${entry.text}`} class="hidden" />
                  <label
                    for={`nav-${entry.text}`}
                    class={classNames(
                      'flex cursor-pointer items-center justify-between gap-1 px-4 py-3 font-heading text-base/6 whitespace-nowrap transition-opacity duration-250 hover:opacity-70 lg:px-3 lg:py-2',
                      color(isActive(entry, metadata.path)),
                    )}
                  >
                    {entry.text}
                    <ChevronDown class="size-3.5 transition-transform duration-200 group-has-[:checked]:rotate-180 lg:group-has-[:checked]:rotate-0" />
                  </label>
                  {/* On wide screens, its ::before keeps the menu open while the pointer crosses the gap to it */}
                  <div class="hidden pl-4 group-has-[:checked]:block lg:absolute lg:top-full lg:right-0 lg:z-10 lg:pl-0 lg:group-focus-within:block lg:group-hover:block lg:before:absolute lg:before:inset-x-0 lg:before:-top-2 lg:before:h-2">
                    <div class="lg:max-h-[calc(100vh-var(--nav-height))] lg:min-w-32 lg:overflow-y-auto lg:rounded-xs lg:border lg:border-frame lg:bg-bg lg:p-3 lg:shadow-lg">
                      {entry.items.map((child) => (
                        <a
                          key={child.link}
                          class={classNames(
                            'flex items-center justify-between rounded-md px-4 py-1.5 font-heading text-[14px] whitespace-nowrap transition-[opacity,background-color] duration-250 hover:text-brand lg:px-3 lg:py-2 lg:hover:bg-default-soft',
                            isCurrent(child.link, metadata.path) ? 'text-brand' : 'text-text-1',
                          )}
                          href={child.link}
                          {...external(child.link)}
                        >
                          {child.text}
                          {isExternal(child.link) && (
                            <ArrowUpRight class="ml-1 size-3 text-text-3" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={entry.text}
                  class={classNames(
                    'flex items-center gap-1 px-4 py-3 font-heading text-base/6 whitespace-nowrap transition-[opacity,color] duration-250 hover:opacity-85 lg:px-3 lg:py-2',
                    color(isActive(entry, metadata.path)),
                  )}
                  href={entry.link}
                  {...external(entry.link)}
                >
                  {entry.text}
                  {isExternal(entry.link) && <ArrowUpRight class="ml-1 size-3 text-text-3" />}
                </a>
              ),
            )}

            {/* On narrow screens, the appearance switch and social links close the panel */}
            <div class="tick-left tick-right relative mt-auto space-y-6 border-t border-stroke pt-6 lg:hidden dark:border-nickel">
              {!forcedTheme && (
                <div class="flex items-center justify-between px-4">
                  <span class="text-sm font-medium text-grey dark:text-white/80">Appearance</span>
                  <ThemeToggle />
                </div>
              )}
              <div class="flex items-center justify-center gap-4 pt-4">
                <SocialLinks links={socialLinks} />
              </div>
            </div>
          </nav>
        </div>

        <div class="flex items-center gap-2 lg:gap-4">
          <div class="hidden items-center lg:flex">
            <SearchBox pathname={metadata.path} />
          </div>

          {/* The appearance switch and social links fold into a menu on medium widths */}
          <div class="group relative hidden items-center lg:flex xl:hidden">
            <button
              type="button"
              class="flex items-center px-3 py-2 text-primary transition-opacity duration-250 hover:opacity-70 dark:text-white"
              aria-haspopup="true"
              aria-label="extra navigation"
            >
              <MoreHorizontal class="size-5" />
            </button>
            <div class="absolute top-full right-0 z-10 hidden group-focus-within:block group-hover:block before:absolute before:inset-x-0 before:-top-2 before:h-2">
              <div class="min-w-32 rounded-xs border border-frame bg-bg p-3 shadow-lg">
                {!forcedTheme && (
                  <div class="mb-3 flex min-w-44 items-center justify-between gap-6 border-b border-divider px-3 pb-3">
                    <p class="text-[12px]/7 font-medium text-text-2">Appearance</p>
                    <ThemeToggle />
                  </div>
                )}
                <SocialLinks links={socialLinks} />
              </div>
            </div>
          </div>

          <div class="hidden items-center gap-4 xl:flex">
            {!forcedTheme && <ThemeToggle />}
            <SocialLinks links={socialLinks} />
          </div>

          <label
            for="nav-open"
            class="-mr-2 cursor-pointer p-2 transition-opacity hover:opacity-70 lg:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              class="size-6"
              viewBox="0 0 18 8"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M0 0.75H18" stroke="currentColor" stroke-width="1.5" />
              <path d="M0 6.75H18" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </label>
        </div>
      </header>

      <div class="wrapper tick-left tick-right relative h-0" />
    </div>
  );
};
