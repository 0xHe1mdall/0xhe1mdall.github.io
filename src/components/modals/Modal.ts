/**
 * Generic modal dialog. Handles open/close, ESC, click-outside, focus trap,
 * and ARIA attributes. Keep modal content render-pure: pass it as `body`.
 */

import { el } from '../../lib/dom';
import { createFocusTrap, type FocusTrap } from '../../lib/focus-trap';

export interface ModalOptions {
  id: string;
  title: string; // HTML allowed (used for "<span class='cmt'>// comment</span>")
  body: HTMLElement;
  footer?: HTMLElement;
  /** Called after the modal closes (any reason). */
  onClose?: () => void;
}

export interface ModalHandle {
  root: HTMLElement;
  open(): void;
  close(): void;
  isOpen(): boolean;
}

export function createModal(opts: ModalOptions): ModalHandle {
  const titleId = `${opts.id}-title`;

  const closeBtn = el('button', {
    class: 'modal-close',
    attrs: { type: 'button', 'aria-label': 'Close dialog', title: 'Close' },
    text: '×',
  });

  const dialog = el(
    'div',
    {
      class: 'modal',
      attrs: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': titleId,
        tabindex: '-1',
      },
    },
    [
      el('header', { class: 'modal-header' }, [
        el('div', {
          class: 'modal-title',
          id: titleId,
          html: opts.title,
        }),
        closeBtn,
      ]),
      el('div', { class: 'modal-body' }, [opts.body]),
      ...(opts.footer ? [opts.footer] : []),
    ],
  );

  const overlay = el(
    'div',
    {
      class: 'modal-overlay',
      id: opts.id,
      attrs: { 'data-open': 'false' },
    },
    [dialog],
  );

  const trap: FocusTrap = createFocusTrap(dialog);
  let open = false;

  const close = () => {
    if (!open) return;
    open = false;
    overlay.setAttribute('data-open', 'false');
    trap.deactivate();
    opts.onClose?.();
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  return {
    root: overlay,
    open() {
      if (open) return;
      open = true;
      overlay.setAttribute('data-open', 'true');
      trap.activate();
    },
    close,
    isOpen: () => open,
  };
}
