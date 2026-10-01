import { classNames, containsCurrent, isCurrent, isExternal } from '../utils.mjs';
import { ChevronRight } from './icons.jsx';

const SidebarItem = ({ item, depth, path }) => {
  const hasChildren = Boolean(item.items?.length);
  const collapsible = hasChildren && item.collapsed !== undefined;
  const active = Boolean(item.link) && isCurrent(item.link, path);
  const hasActive = containsCurrent(item, path);

  // Group titles are headings, like the default VitePress theme renders them
  const Text = hasChildren && depth < 5 ? `h${depth + 2}` : 'p';

  const text = (
    <Text
      class={classNames(
        'm-0 grow py-1 text-[14px]/6 transition-colors duration-250',
        depth === 0 ? 'font-bold' : 'font-medium',
        active ? 'text-brand' : hasActive || depth === 0 ? 'text-text-1' : 'text-text-2',
        item.link && 'group-hover/link:text-brand',
      )}
    >
      {item.text}
    </Text>
  );

  const row = (
    <div class="group/row relative flex w-full items-center gap-1.5">
      {item.link ? (
        <a
          class="group/link flex grow"
          href={item.link}
          {...(isExternal(item.link)
            ? { target: '_blank', rel: 'noreferrer' }
            : { rel: 'prefetch' })}
        >
          {text}
        </a>
      ) : (
        text
      )}
      {collapsible && (
        <span
          class="-mr-[7px] flex size-8 shrink-0 items-center justify-center text-text-3 transition-colors duration-250 group-hover/row:text-text-2"
          aria-hidden="true"
        >
          <ChevronRight class="size-[18px] rotate-90 transition-transform duration-250 [details:not([open])>summary_&]:rotate-0" />
        </span>
      )}
    </div>
  );

  const children = hasChildren && (
    <div class={classNames(depth > 0 && 'border-l border-divider pl-4')}>
      {item.items.map((child) => (
        <SidebarItem key={child.text} item={child} depth={depth + 1} path={path} />
      ))}
    </div>
  );

  return collapsible ? (
    <details open={!item.collapsed || hasActive}>
      <summary class="cursor-pointer list-none [&::-webkit-details-marker]:hidden">{row}</summary>
      {children}
    </details>
  ) : (
    <section>
      {row}
      {children}
    </section>
  );
};

/**
 * Groups a sidebar's items as VitePress does: consecutive links outside of a
 * group form one group without a title.
 *
 * @param {Array} items
 */
const toGroups = (items) =>
  items.reduce((groups, item) => {
    if (item.items) {
      groups.push(item);
    } else if (groups.at(-1)?.untitled) {
      groups.at(-1).items.push(item);
    } else {
      groups.push({ untitled: true, items: [item] });
    }

    return groups;
  }, []);

/**
 * The sidebar of the current section of the site: a drawer on narrower
 * screens, a column beside the content on wider ones.
 *
 * @param {{ groups: Array, path: string }} props
 */
export default ({ groups, path }) => (
  <aside
    id="sidebar"
    class="fixed inset-y-0 left-0 z-60 w-[calc(100vw-64px)] max-w-80 -translate-x-[calc(100%+1rem)] overflow-x-hidden overflow-y-auto overscroll-contain border-r border-divider bg-bg px-8 pt-5 pb-24 opacity-0 shadow-3 [transition:opacity_0.5s,translate_0.25s_ease] sidebar-open:translate-x-0 sidebar-open:opacity-100 sidebar-open:[transition:opacity_0.25s,translate_0.5s_cubic-bezier(0.19,1,0.22,1)] lg:sticky lg:top-[calc(var(--nav-height)-1px)] lg:bottom-auto lg:left-auto lg:z-auto lg:col-start-1 lg:row-start-2 lg:h-[calc(100vh-var(--nav-height)+1px)] lg:w-(--sidebar-width) lg:max-w-full lg:translate-x-0 lg:self-start lg:bg-transparent lg:opacity-100 lg:shadow-none"
  >
    <nav aria-label="Sidebar Navigation">
      {toGroups(groups).map((group, index) => (
        <div
          key={group.text ?? index}
          class="not-first:mt-4 not-first:border-t not-first:border-divider not-first:pt-4 min-[960px]:w-[calc(var(--sidebar-width)-64px)]"
        >
          {group.untitled ? (
            group.items.map((item) => (
              <SidebarItem key={item.text} item={item} depth={1} path={path} />
            ))
          ) : (
            <SidebarItem item={group} depth={0} path={path} />
          )}
        </div>
      ))}
    </nav>
  </aside>
);
