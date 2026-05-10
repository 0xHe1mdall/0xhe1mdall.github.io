import { el, mount } from '../lib/dom';
import type { Section } from '../types';

export function renderXrefs(host: HTMLElement, section: Section): void {
  const tabs = el('div', { class: 'bottom-tabs', attrs: { role: 'tablist' } }, [
    btab('Cross References', true),
    btab('Variables', false),
    btab('Tags', false),
    btab('Log', false),
  ]);

  const items = section.xrefs.flatMap(x => [
    el('div', { class: 'xref-tree-item' }, [
      el('span', { class: 'arrow', text: '▾' }),
      el('span', { class: 'xref-fn', text: x.fn }),
      document.createTextNode('  {1}'),
    ]),
    el('div', { class: 'xref-tree-item xref-sub' }, [
      el('span', { class: 'arrow', text: x.arrow }),
      el('span', { class: 'xref-addr', text: ` ${x.addr} ` }),
      el('span', {
        attrs: { style: 'color:var(--text-faint)' },
        text: '__libc_start_main',
      }),
    ]),
  ]);

  const content = el('div', { class: 'xref-content' }, [
    el('div', { class: 'xref-section' }, [
      el('div', { class: 'xref-label', text: '▸ Filter ( )' }),
      el('div', {
        class: 'xref-label',
        attrs: { style: 'margin-top:8px' },
        html: `▾ Code References &nbsp;<span style="color:var(--text-faint)">{${section.xrefs.length}}</span>`,
      }),
      ...items,
    ]),
  ]);

  mount(host, el('div', { attrs: { style: 'display:contents' } }, [tabs, content]));
}

function btab(label: string, active: boolean): HTMLElement {
  return el('button', {
    class: 'btab',
    attrs: { role: 'tab', 'aria-selected': String(active) },
    text: label,
  });
}
