// Links in the navigation are clean URLs (`/guide/introduction`, and `/apis/`
// for a directory's index page); doc-kit identifies pages by their source path
// (`/guide/introduction`, `/apis/index`).

/**
 * The clean URL of a page.
 *
 * @param {string} path - The page's doc-kit path, e.g. `/builtin-plugins/index`
 */
export const pageURL = (path) => path.replace(/(^|\/)index$/, '$1') || '/';

/**
 * @param {string} link
 */
export const isExternal = (link) => /^https?:\/\//.test(link);

/**
 * Normalizes a link for comparison with a page URL: no `.md`/`.html`
 * extension, no hash.
 *
 * @param {string} link
 */
const normalizeLink = (link) => pageURL(link.split('#')[0].replace(/\.(md|html)$/, ''));

/**
 * Whether a navigation link points at the current page. Links to a section of
 * a page are not, as in VitePress: pages are rendered without a hash.
 *
 * @param {string} link
 * @param {string} path - The current page's doc-kit path
 */
export const isCurrent = (link, path) =>
  !isExternal(link) && !link.includes('#') && normalizeLink(link) === pageURL(path);

/**
 * Whether a sidebar item or any of its children points at the current page.
 *
 * @param {{ link?: string, items?: Array }} item
 * @param {string} path
 */
export const containsCurrent = (item, path) =>
  (item.link !== undefined && isCurrent(item.link, path)) ||
  (item.items ?? []).some((child) => containsCurrent(child, path));

/**
 * Picks the sidebar of the section a page belongs to: the longest matching
 * path prefix. A sidebar given as another prefix is that prefix's sidebar.
 *
 * @param {Record<string, Array | string>} sidebars
 * @param {string} path
 */
export const findSidebar = (sidebars, path) => {
  const url = pageURL(path);
  const prefix = Object.keys(sidebars)
    .filter((key) => url.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];

  const sidebar = prefix ? sidebars[prefix] : [];

  return typeof sidebar === 'string' ? sidebars[sidebar] : sidebar;
};

/**
 * Lists a sidebar's page links in reading order, for the previous / next
 * page links.
 *
 * @param {Array<{ text: string, link?: string, items?: Array }>} items
 * @returns {Array<{ text: string, link: string }>}
 */
export const flattenSidebar = (items) =>
  items.flatMap(({ text, link, items: children = [] }) => [
    ...(link && !isExternal(link) ? [{ text, link }] : []),
    ...flattenSidebar(children),
  ]);

/**
 * Joins the class names that apply.
 *
 * @param {Array<string | false | null | undefined>} names
 */
export const classNames = (...names) => names.filter(Boolean).join(' ');
