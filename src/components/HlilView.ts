import { el, mount } from '../lib/dom';
import type { Section } from '../types';

export function renderHlil(host: HTMLElement, section: Section): void {
  const lines = section.hlil.map(line =>
    el(
      'div',
      {
        class: `hlil-line${line.indent ? ` indent-${line.indent}` : ''}`,
        on: {
          click: (e) => {
            (e.currentTarget as HTMLElement).classList.toggle('selected');
          },
        },
      },
      [
        el('span', { class: 'hlil-lnum', text: String(line.n) }),
        el('span', { class: 'hlil-code', html: line.code }),
      ],
    ),
  );
  mount(host, el('div', { attrs: { style: 'display:contents' } }, lines));
}
