import { useRef, useState } from 'preact/hooks';

import { classNames } from '../utils.mjs';

import 'virtual:group-icons.css';

/**
 * Parses a `highlight="5"` / `highlight="5-7,9"` fence attribute into
 * 1-based line ranges.
 */
const parseHighlight = (value) =>
  String(value ?? '')
    .split(',')
    .map((range) => range.trim().split('-').map(Number))
    .filter(([start]) => start > 0)
    .map(([start, end = start]) => ({ start, count: end - start + 1 }));

/**
 * Replaces the code box of doc-kit's `CodeBox` island: the highlighted code
 * with its language, an optional file name, highlighted lines and a copy
 * button.
 */
export default ({ className = '', style, displayName, highlight, children }) => {
  const pre = useRef(null);
  const [copied, setCopied] = useState(false);

  const language = /language-(\S+)/.exec(className)?.[1] ?? '';

  const copy = () => {
    navigator.clipboard.writeText(pre.current.textContent.replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // A page's code blocks span its width on small screens; in a group of
    // tabs, the tab names a block
    <div
      class="relative mx-0 my-4 overflow-hidden rounded-lg bg-code-block-bg in-[.custom-block]:my-2 in-[[data-code-group]]:m-0 in-[[data-code-group]]:rounded-none max-sm:[.markdown>is-land>&]:-mx-6 max-sm:[.markdown>is-land>&]:rounded-none"
      data-code-block
    >
      {displayName && (
        <div class="flex items-center px-6 text-[14px]/12 font-medium text-text-2 shadow-[inset_0_-1px_var(--color-gutter)] in-[[data-code-group]]:hidden dark:shadow-[inset_0_-1px_var(--color-midnight)]">
          <span data-title={displayName}>{displayName}</span>
        </div>
      )}

      <div class="group relative">
        <button
          type="button"
          class={classNames(
            'peer absolute top-3 right-3 z-3 size-10 cursor-pointer rounded-sm border border-divider bg-size-[20px] bg-center bg-no-repeat opacity-0 [transition:border-color_0.25s,background-color_0.25s,opacity_0.25s] group-hover:opacity-100 hover:bg-bg focus:opacity-100',
            copied
              ? "bg-bg bg-[url(/icons/copied.svg)] before:absolute before:-top-px before:right-[calc(100%+1px)] before:flex before:h-10 before:items-center before:rounded-l-sm before:border before:border-r-0 before:border-divider before:bg-bg before:px-2.5 before:text-[12px] before:font-medium before:whitespace-nowrap before:text-text-2 before:content-['Copied']"
              : 'bg-bg-soft bg-[url(/icons/copy.svg)]',
          )}
          title="Copy code"
          aria-label="Copy code"
          onClick={copy}
        />
        <span class="absolute top-0.5 right-2 z-2 text-[12px] font-medium text-text-2 select-none [transition:color_0.4s,opacity_0.4s] group-hover:opacity-0 peer-focus:opacity-0">
          {language}
        </span>

        {/* `highlight="2-4"`: the highlighted lines, behind the code */}
        {parseHighlight(highlight).map(({ start, count }) => (
          <div
            key={start}
            class="absolute inset-x-0 top-[calc(20px+var(--start)*var(--code-line-height)*14px)] h-[calc(var(--count)*var(--code-line-height)*14px)] bg-default-soft"
            aria-hidden="true"
            style={{ '--start': start - 1, '--count': count }}
          />
        ))}

        <pre
          ref={pre}
          class={classNames(
            className,
            'relative z-1 m-0 overflow-x-auto bg-transparent! py-5 text-left [tab-size:4]',
          )}
          style={style}
          tabIndex={0}
        >
          {children}
        </pre>
      </div>
    </div>
  );
};
