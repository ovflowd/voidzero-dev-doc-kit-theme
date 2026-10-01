import { AlignLeft, ChevronRight } from './icons.jsx';
import { OutlineItems, toOutline } from './Outline.jsx';

/**
 * The bar above the content on narrower screens: a label opening the sidebar
 * (`#sidebar-open`) and the page outline as a disclosure. No JavaScript is
 * involved.
 *
 * @param {{ headings: Array<{ depth: number, value: string, slug: string }>, hasSidebar: boolean }} props
 */
export default ({ headings, hasSidebar }) => (
  <div class="relative flex items-center justify-between lg:border-b lg:border-frame">
    {hasSidebar && (
      <label
        for="sidebar-open"
        class="flex cursor-pointer items-center px-6 pt-3 pb-[11px] text-[12px]/6 font-medium text-text-2 transition-colors duration-500 hover:text-text-1 hover:duration-250 md:px-8 lg:hidden"
      >
        <AlignLeft class="mr-2 size-3.5" />
        Menu
      </label>
    )}

    {headings.length > 0 ? (
      <details class="group min-[960px]:relative min-[960px]:w-fit">
        <summary class="flex cursor-pointer list-none items-center px-6 pt-3 pb-[11px] text-[12px]/6 font-medium text-text-2 transition-colors duration-500 group-open:text-text-1 group-open:duration-250 hover:text-text-1 hover:duration-250 md:px-8 min-[960px]:text-[14px] [&::-webkit-details-marker]:hidden">
          On this page
          <ChevronRight class="ml-0.5 size-3.5 transition-transform duration-250 group-open:rotate-90" />
        </summary>

        <div class="absolute inset-x-4 top-10 grid max-h-[calc(100vh-150px)] gap-px overflow-x-hidden overflow-y-auto rounded-lg border border-border bg-gutter shadow-3 min-[960px]:right-auto min-[960px]:left-8 min-[960px]:w-80">
          <a class="block bg-bg-soft px-4 text-[14px]/12 font-medium text-brand" href="#">
            Return to top
          </a>
          <OutlineItems items={toOutline(headings)} class="bg-bg-soft px-4 py-2" />
        </div>
      </details>
    ) : (
      <a
        href="#"
        class="flex items-center px-6 pt-3 pb-[11px] text-[12px]/6 font-medium text-text-2 transition-colors duration-500 hover:text-text-1 hover:duration-250 md:px-8 min-[960px]:text-[14px]"
      >
        Return to top
      </a>
    )}
  </div>
);
