import withIsland from '@doc-kit/generator-react/html/ui/islands/withIsland.jsx';
import { useEffect, useRef, useState } from 'preact/hooks';

/**
 * The sections matching a filter: a section whose title matches whole,
 * otherwise only its items matching.
 *
 * @param {Array<{ text: string, items: Array<{ text: string, link: string }> }>} sections
 * @param {string} query
 */
const filterSections = (sections, query) => {
  const matches = (text) => text.toLowerCase().includes(query.trim().toLowerCase());

  return sections
    .map((section) =>
      matches(section.text)
        ? section
        : { ...section, items: section.items.filter((item) => matches(item.text)) },
    )
    .filter((section) => section.items.length > 0);
};

/**
 * The landing page of an API reference: every entry, by section, filterable
 * by name.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {Array<{ text: string, items: Array<{ text: string, link: string }> }>} props.sections
 */
const ReferenceIndex = ({ title, description, sections: allSections }) => {
  const [query, setQuery] = useState('');
  const input = useRef(null);

  useEffect(() => input.current?.focus(), []);

  const sections = filterSections(allSections, query);

  // `raw`: the Markdown styles of the page don't apply; headings sit in
  // <header> and <section>, which doc-kit doesn't lay out as heading rows
  return (
    <div class="raw">
      <header class="flex items-center justify-between max-md:block">
        <h1 class="m-0 font-heading text-[38px]/none font-semibold tracking-[-0.02em] max-md:mb-6 max-md:text-[32px]">
          {title}
        </h1>
        <div class="flex items-center gap-4">
          <label for="api-filter">Filter</label>
          <input
            ref={input}
            id="api-filter"
            type="search"
            placeholder="Enter keyword"
            class="rounded-lg px-3 py-1.5 transition-shadow duration-250 ease-[ease] focus:shadow-[0_0_4pt_var(--color-brand)]"
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
      </header>

      <p class="my-4 text-[16px]/7">{description}</p>

      {sections.map((section) => (
        <section key={section.text} class="mt-12 mb-16">
          <h2 class="mb-4 border-t border-current pt-9 font-heading text-2xl/none font-semibold tracking-[-0.02em]">
            {section.text}
          </h2>
          <div class="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <a
                key={item.link}
                href={item.link}
                class="flex flex-col rounded-lg border border-[rgb(128_128_128/0.2)] px-3 py-6 text-[14px]/[1.4] font-medium text-text-1 transition-[border-color] duration-250 hover:border-brand"
              >
                {item.text}
              </a>
            ))}
          </div>
        </section>
      ))}

      {sections.length === 0 && (
        <div class="mt-9 border-t border-divider pt-9 text-center text-[1.2em] text-text-3">
          No API reference matching "{query}" found.
        </div>
      )}
    </div>
  );
};

export default withIsland(ReferenceIndex, { name: 'ReferenceIndex', on: { idle: true } });
