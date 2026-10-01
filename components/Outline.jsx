import withIsland from '@doc-kit/generator-react/html/ui/islands/withIsland.jsx';
import { useEffect, useRef, useState } from 'preact/hooks';

import { classNames } from '../utils.mjs';

// How far below the top of the viewport a heading becomes the current one
const ACTIVE_OFFSET = 120;

/**
 * The headings shown in a page's outline: everything below the title.
 *
 * @param {Array<{ depth: number }>} headings
 */
export const outlineHeadings = (headings) => headings.filter(({ depth }) => depth > 1);

/**
 * Nests a page's flat heading list (h2, h3) into the outline's tree.
 *
 * @param {Array<{ depth: number, value: string, slug: string }>} headings
 */
export const toOutline = (headings) => {
  const root = [];

  for (const { depth, value, slug } of headings) {
    const item = { title: value, slug, children: [] };

    if (depth > 2 && root.length) {
      root.at(-1).children.push(item);
    } else {
      root.push(item);
    }
  }

  return root;
};

/**
 * The links of an outline, nested as its headings are.
 *
 * @param {{ items: ReturnType<typeof toOutline>, active?: string, class?: string }} props
 */
export const OutlineItems = ({ items, active, class: className }) => (
  <ul class={classNames('relative z-1', className)}>
    {items.map(({ title, slug, children }) => (
      <li key={slug}>
        <a
          class={classNames(
            'block overflow-hidden text-[13px]/7 font-normal text-ellipsis whitespace-nowrap transition-colors duration-500 hover:text-text-1 hover:duration-250',
            slug === active ? 'text-text-1 duration-250' : 'text-text-2',
          )}
          href={`#${slug}`}
          title={title}
        >
          {title}
        </a>
        {children.length > 0 && <OutlineItems items={children} active={active} class="px-4" />}
      </li>
    ))}
  </ul>
);

/**
 * Tracks the heading the reader is at: the last one scrolled past, or the
 * last heading of the page once it is scrolled to the bottom.
 *
 * @param {Array<{ slug: string }>} headings
 */
const useActiveHeading = (headings) => {
  const [active, setActive] = useState();

  useEffect(() => {
    const elements = headings.map(({ slug }) => document.getElementById(slug)).filter(Boolean);

    const update = () => {
      const atBottom =
        Math.abs(window.scrollY + window.innerHeight - document.body.offsetHeight) < 1;

      if (atBottom && elements.length) {
        setActive(elements.at(-1).id);
        return;
      }

      const passed = elements.filter(
        (element) => element.getBoundingClientRect().top < ACTIVE_OFFSET,
      );

      setActive(passed.at(-1)?.id);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });

    return () => window.removeEventListener('scroll', update);
  }, [headings]);

  return active;
};

/**
 * The "On this page" outline beside the content, highlighting the current
 * heading.
 *
 * @param {{ headings: Array<{ depth: number, value: string, slug: string }> }} props
 */
const Outline = ({ headings }) => {
  const active = useActiveHeading(headings);
  const container = useRef(null);
  const [markerTop, setMarkerTop] = useState();

  useEffect(() => {
    const link = active && container.current?.querySelector(`a[href="#${CSS.escape(active)}"]`);

    setMarkerTop(
      link
        ? link.getBoundingClientRect().top - container.current.getBoundingClientRect().top + 5
        : undefined,
    );
  }, [active]);

  return (
    <nav class="relative text-[13px] font-medium" ref={container} aria-labelledby="outline-title">
      {/* The bar beside the current heading's link */}
      <div
        class="absolute top-8 -left-[33px] z-0 h-[18px] w-0.5 rounded-xs bg-text-1 opacity-0 [transition:top_0.25s_cubic-bezier(0,1,0.5,1),background-color_0.5s,opacity_0.25s]"
        style={markerTop === undefined ? undefined : { top: `${markerTop}px`, opacity: 1 }}
      />
      <div
        class="flex items-center gap-2 text-[12px]/8 tracking-[0.025em] text-grey uppercase"
        id="outline-title"
        role="heading"
        aria-level={2}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M7.3335 3.66669H14.0002"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
          />
          <path
            d="M3.6 11.2618C4.31111 11.738 4.66667 11.9762 4.66667 12.3334C4.66667 12.6906 4.31111 12.9287 3.6 13.405C2.88889 13.8812 2.53333 14.1193 2.26667 13.9408C2 13.7622 2 13.2859 2 12.3334C2 11.3808 2 10.9046 2.26667 10.726C2.53333 10.5474 2.88889 10.7855 3.6 11.2618Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
          />
          <path
            d="M3.6 2.59509C4.31111 3.07135 4.66667 3.30947 4.66667 3.66667C4.66667 4.02386 4.31111 4.26199 3.6 4.73825C2.88889 5.21451 2.53333 5.45263 2.26667 5.27403C2 5.09544 2 4.61918 2 3.66667C2 2.71415 2 2.23789 2.26667 2.0593C2.53333 1.8807 2.88889 2.11883 3.6 2.59509Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
          />
          <path
            d="M7.3335 8H14.0002"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
          />
          <path
            d="M7.3335 12.3333H14.0002"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
          />
        </svg>
        On this page
      </div>
      <OutlineItems items={toOutline(headings)} active={active} />
    </nav>
  );
};

export default withIsland(Outline, { name: 'Outline', on: { idle: true } });
