/**
 * Toast notification controller. Initialized once with the host element,
 * exposes show() to display a transient message.
 */

import { el, mount } from '../lib/dom';
import { CONFIG } from '../config';

export interface Notifier {
  show(title: string, message: string): void;
}

export function createNotifier(host: HTMLElement): Notifier {
  const titleEl = el('div', { class: 'notif-title' });
  const msgEl = el('div', { class: 'notif-msg' });
  mount(host, el('div', { attrs: { style: 'display:contents' } }, [titleEl, msgEl]));

  let timer: number | null = null;

  return {
    show(title, message) {
      titleEl.textContent = title;
      msgEl.textContent = message;
      host.classList.add('show');
      if (timer != null) clearTimeout(timer);
      timer = window.setTimeout(() => host.classList.remove('show'), CONFIG.notifMs);
    },
  };
}
