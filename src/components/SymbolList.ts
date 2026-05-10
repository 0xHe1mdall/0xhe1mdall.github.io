import { el, mount } from '../lib/dom';
import type { SectionId, Symbol_ } from '../types';

interface SymbolListProps {
  symbols: readonly Symbol_[];
  currentSection: SectionId;
  query: string;
  onSelectSection: (id: SectionId) => void;
  onClickImport: (name: string) => void;
  onQueryChange: (q: string) => void;
}

export function renderSymbolList(host: HTMLElement, props: SymbolListProps): void {
  const search = el('div', { class: 'search-box' }, [
    el('span', { class: 'search-icon', attrs: { 'aria-hidden': 'true' }, text: '⌕' }),
    el('input', {
      attrs: {
        type: 'text',
        placeholder: 'Search...',
        'aria-label': 'Search symbols',
        value: props.query,
      },
      on: {
        input: (e) => props.onQueryChange((e.target as HTMLInputElement).value),
      },
    }),
  ]);

  const lower = props.query.toLowerCase();
  const items = props.symbols
    .filter(s => s.name.toLowerCase().includes(lower))
    .map(sym => {
      const isActive = sym.section === props.currentSection;
      return el(
        'button',
        {
          class: 'symbol-item',
          attrs: {
            'aria-current': isActive ? 'true' : 'false',
            'data-name': sym.name,
          },
          on: {
            click: () => {
              if (sym.section) props.onSelectSection(sym.section);
              else props.onClickImport(sym.name);
            },
          },
        },
        [
          el('span', {
            class: `symbol-dot ${sym.kind === 'import' ? 'dot-import' : 'dot-func'}`,
            attrs: { 'aria-hidden': 'true' },
          }),
          document.createTextNode(sym.name),
        ],
      );
    });

  const list = el('div', { class: 'symbol-list', attrs: { role: 'list' } }, items);

  const header = el('header', { class: 'panel-header' }, [
    el('span', { class: 'panel-title', text: 'Symbols' }),
  ]);

  mount(host, el('div', { attrs: { style: 'display:contents' } }, [header, search, list]));
}
