import { el, mount } from '../lib/dom';
import type { Section } from '../types';

export function renderStatusBar(host: HTMLElement, section: Section): void {
  mount(
    host,
    el('div', { attrs: { style: 'display:contents' } }, [
      el('div', { class: 'status-item', text: 'linux-x86_64' }),
      el('div', { class: 'status-sep', text: '|' }),
      el('div', { class: 'status-item', text: section.statusAddr }),
      el('div', { class: 'status-sep', text: '|' }),
      el('div', { class: 'status-item', text: section.fnName }),
      el('div', { class: 'status-right' }, [
        el('div', { class: 'status-item', text: 'O2' }),
        el('div', { class: 'status-sep', text: '|' }),
        el('div', { class: 'status-item', text: section.statusInfo }),
      ]),
    ]),
  );
}
