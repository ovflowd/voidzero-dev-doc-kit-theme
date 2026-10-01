import withIsland from '@doc-kit/generator-react/html/ui/islands/withIsland.jsx';
import { useEffect, useState } from 'preact/hooks';

import { Moon, Sun } from './icons.jsx';

/**
 * Toggles between the light and dark color schemes, remembering the choice
 * (the inline script in the page template applies it before first paint).
 */
const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const toggle = () => {
    const scheme = dark ? 'light' : 'dark';
    const root = document.documentElement;

    root.setAttribute('data-theme', scheme);
    root.style.colorScheme = scheme;
    localStorage.setItem('theme', scheme);
    setDark(!dark);
  };

  return (
    <button
      type="button"
      role="switch"
      class="relative block h-[22px] w-10 shrink-0 rounded-[11px] border border-border bg-default-soft transition-[border-color] duration-250 hover:border-brand"
      aria-checked={dark}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
    >
      <span class="absolute top-px left-px size-[18px] rounded-full bg-bg shadow-[0_1px_2px_rgb(0_0_0/0.04),0_1px_2px_rgb(0_0_0/0.06)] transition-transform duration-250 dark:translate-x-[18px]">
        <Sun class="absolute top-[3px] left-[3px] size-3 text-text-2 transition-opacity duration-250 dark:text-text-1 dark:opacity-0" />
        <Moon class="absolute top-[3px] left-[3px] size-3 text-text-2 transition-opacity duration-250 dark:text-text-1 opacity-0 dark:opacity-100" />
      </span>
    </button>
  );
};

export default withIsland(ThemeToggle, { name: 'ThemeToggle', on: { idle: true } });
