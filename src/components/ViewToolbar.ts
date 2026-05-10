import { el, mount } from '../lib/dom';
import type { ViewKind } from '../types';

interface ToolbarProps {
  view: ViewKind;
  signature: string;
  onView: (v: ViewKind) => void;
}

export function renderToolbar(host: HTMLElement, props: ToolbarProps): void {
  const button = (kind: ViewKind, label: string) =>
    el(
      'button',
      {
        class: 'view-btn',
        attrs: {
          'aria-pressed': String(props.view === kind),
          'data-view': kind,
        },
        on: { click: () => props.onView(kind) },
      },
      [el('span', { text: `${label} ` }), el('span', { class: 'chevron', text: '▾' })],
    );

  const sig = el('div', { class: 'fn-sig', html: props.signature });

  mount(
    host,
    el('div', { attrs: { style: 'display:contents' } }, [
      button('graph', 'Graph'),
      button('hlil', 'High Level IL'),
      el('div', { class: 'view-separator' }),
      sig,
    ]),
  );
}
