import SearchInput from '@node-core/ui-components/Common/Search/Input';
import styles from '@node-core/ui-components/Common/Search/Modal/index.module.css';
import { Modal, SearchRoot } from '@orama/ui/components';

import { Search } from './icons.jsx';

/**
 * Replaces the modal of doc-kit's `SearchBox` island, keeping its search
 * dialog but opening it from the Rolldown site's search button.
 */
export default ({ children, client }) => (
  <Modal.Root>
    <Modal.Trigger
      type="button"
      disabled={!client}
      enableCmdK
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-bg-alt px-3 py-2 text-[14px]/none text-text-2"
      aria-label="Search"
    >
      <Search class="size-3.5" />
      <span class="text-[13px]">Search</span>
      <span
        class="flex items-center gap-1 rounded-sm border border-divider px-1.5 py-1 text-[12px] [&_kbd]:font-[inherit] [&_kbd]:font-medium"
        aria-hidden="true"
      >
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </span>
    </Modal.Trigger>

    <Modal.Wrapper closeOnOutsideClick closeOnEscape className={styles.modalWrapper}>
      <SearchRoot client={client}>
        <Modal.Inner className={styles.modalInner}>
          <Modal.Content className={styles.modalContent}>
            <SearchInput placeholder="Search docs" ariaLabel="Search docs" />
            <Modal.Close className={styles.modalCloseButton} />
            {children}
          </Modal.Content>
        </Modal.Inner>
      </SearchRoot>
    </Modal.Wrapper>
  </Modal.Root>
);
