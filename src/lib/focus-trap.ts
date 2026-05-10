/**
 * Focus trap for modal dialogs. Keeps Tab/Shift-Tab inside the modal while
 * open, restores focus to the previously-focused element on close.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
  let prevFocus: HTMLElement | null = null;
  let active = false;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const activeEl = document.activeElement as HTMLElement | null;

    if (e.shiftKey && activeEl === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return {
    activate() {
      if (active) return;
      active = true;
      prevFocus = document.activeElement as HTMLElement | null;
      // Defer focus until after the modal is visible so screen-readers see it.
      requestAnimationFrame(() => {
        const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusables.length > 0) focusables[0]!.focus();
        else container.focus();
      });
      container.addEventListener('keydown', onKeyDown);
    },
    deactivate() {
      if (!active) return;
      active = false;
      container.removeEventListener('keydown', onKeyDown);
      prevFocus?.focus?.();
      prevFocus = null;
    },
  };
}
