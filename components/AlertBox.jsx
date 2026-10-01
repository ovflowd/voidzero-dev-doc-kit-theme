import { toChildArray } from 'preact';

// doc-kit's alert levels, as the custom block they render as
const KINDS = {
  success: 'tip',
  neutral: 'info',
  info: 'important',
  warning: 'warning',
  danger: 'danger',
};

const isBlank = (child) => typeof child === 'string' && !child.trim();

/**
 * An alert opening with a paragraph that holds nothing but bold text uses
 * that text as its title:
 *
 *   > [!WARNING]
 *   > **Performance Overhead**
 *   >
 *   > ...
 */
const splitTitle = (children) => {
  const nodes = toChildArray(children).filter((child) => !isBlank(child));
  const [first, ...rest] = nodes;

  if (first?.type === 'p') {
    const inner = toChildArray(first.props.children).filter((child) => !isBlank(child));

    if (inner.length === 1 && inner[0]?.type === 'strong') {
      return { title: inner[0].props.children, body: rest };
    }
  }

  return { title: undefined, body: nodes };
};

/**
 * Replaces doc-kit's `AlertBox` (GitHub alerts and stability indicators) with
 * the custom blocks of the Rolldown site.
 */
export default ({ level, title = '', children }) => {
  const kind = KINDS[level] ?? 'info';

  // Stability indicators are a single line: "Stability: 1 – Experimental"
  if (title.startsWith('Stability')) {
    return (
      <div class={`custom-block ${kind} stability`}>
        <p>
          <strong>{title}</strong> – {children}
        </p>
      </div>
    );
  }

  const { title: customTitle, body } = splitTitle(children);

  return (
    <div class={`custom-block ${kind}`}>
      <p class="custom-block-title">{customTitle ?? title.toUpperCase()}</p>
      {body}
    </div>
  );
};
