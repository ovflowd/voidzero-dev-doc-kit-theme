import { BrandIcon } from './icons.jsx';
import { isExternal } from '../utils.mjs';

/**
 * The footer of marketing pages: the site's navigation in columns, social
 * links and the copyright.
 *
 * @param {object} props
 * @param {{ nav: Array<{ title: string, items: Array<{ text: string, link: string }> }>, social: string[], copyright: string }} props.footer
 * @param {Array<{ icon: string, label: string, link: string }>} props.socialLinks The links `footer.social` picks from, by icon
 */
export default ({ footer, socialLinks }) => {
  const social = footer.social.map((icon) => socialLinks.find((link) => link.icon === icon));

  return (
    <footer class="site-footer bg-primary" data-theme="dark">
      <section class="wrapper wrapper--ticks border-t">
        <div class="flex flex-col gap-10 px-5 pt-10 pb-16 md:flex-row md:justify-between md:gap-0 md:px-24 md:pt-16 md:pb-40">
          <div class="flex flex-col gap-10 md:flex-row md:gap-20">
            {footer.nav.map((column) => (
              <div key={column.title}>
                <p class="mb-8 font-mono text-xs tracking-wide text-text-2 uppercase">
                  {column.title}
                </p>
                <ul class="flex flex-col gap-3">
                  {column.items.map((item) => (
                    <li key={item.link}>
                      <a
                        href={item.link}
                        class="text-base text-text-1"
                        {...(isExternal(item.link) && { target: '_blank', rel: 'noreferrer' })}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p class="mb-8 font-mono text-xs tracking-wide text-text-2 uppercase">Social</p>
            <ul class="flex flex-col gap-3">
              {social.map(({ icon, label, link }) => (
                <li key={icon}>
                  <a
                    href={link}
                    class="flex items-center gap-3 text-base text-text-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BrandIcon name={icon} class="size-[18px]" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section class="wrapper wrapper--ticks flex flex-col items-start justify-between gap-3 border-t px-5 py-5 md:flex-row md:items-center md:gap-0 md:px-24">
        <p class="text-sm text-text-2">{footer.copyright}</p>
      </section>
    </footer>
  );
};
