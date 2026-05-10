import { el, mount } from '../lib/dom';
import type { SectionId } from '../types';

interface TabsProps {
  sections: readonly { id: SectionId; label: string }[];
  current: SectionId;
  onSelect: (id: SectionId) => void;
}

export function renderTabs(host: HTMLElement, props: TabsProps): void {
  const items = props.sections.map(s =>
    el(
      'button',
      {
        class: 'tab',
        attrs: {
          role: 'tab',
          'aria-selected': String(s.id === props.current),
          'data-tab': s.id,
          tabindex: s.id === props.current ? 0 : -1,
        },
        on: { click: () => props.onSelect(s.id) },
      },
      [
        el('span', { text: s.label }),
        el('span', { class: 'tab-close', attrs: { 'aria-hidden': 'true' }, text: '×' }),
      ],
    ),
  );
  // Decorative "+" button (matches original look, intentionally inert)
  const addBtn = el('span', {
    class: 'tab-add',
    attrs: { 'aria-hidden': 'true', title: 'New tab' },
    text: '+',
  });
  mount(host, el('div', { attrs: { style: 'display:contents' } }, [...items, addBtn]));
}
