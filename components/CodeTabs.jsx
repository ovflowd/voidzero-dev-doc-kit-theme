import { toChildArray } from 'preact';
import { useState } from 'preact/hooks';

import { classNames } from '../utils.mjs';

/**
 * Replaces the tabs of doc-kit's `CodeTabs` island, which groups adjacent
 * code blocks, labelling each tab with its block's `displayName`.
 */
export default ({ displayNames = '', languages = '', defaultTab = '0', children }) => {
  const [active, setActive] = useState(Number(defaultTab));

  const labels = displayNames.split('|');
  const fallbacks = languages.split('|');
  const panels = toChildArray(children);

  return (
    <div
      class="relative mx-0 my-4 overflow-hidden rounded-lg bg-code-block-bg in-[.custom-block]:my-2 max-sm:[.markdown>is-land>&]:-mx-6 max-sm:[.markdown>is-land>&]:rounded-none"
      data-code-group
    >
      <div
        class="flex items-center overflow-x-auto overflow-y-hidden px-3 shadow-[inset_0_-1px_var(--color-gutter)] dark:shadow-[inset_0_-1px_var(--color-midnight)]"
        role="tablist"
      >
        {panels.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === active}
            class={classNames(
              "relative cursor-pointer border-b border-transparent px-3 text-[14px]/12 font-medium whitespace-nowrap transition-colors duration-250 hover:text-text-1 after:absolute after:inset-x-2 after:-bottom-px after:z-1 after:h-0.5 after:rounded-xs after:transition-colors after:duration-250 after:content-['']",
              index === active ? 'text-text-1 after:bg-brand' : 'text-text-2 after:bg-transparent',
            )}
            data-title={labels[index] || undefined}
            onClick={() => setActive(index)}
          >
            {labels[index] || fallbacks[index]}
          </button>
        ))}
      </div>

      {panels.map((panel, index) => (
        <div key={index} role="tabpanel" hidden={index !== active}>
          {panel}
        </div>
      ))}
    </div>
  );
};
