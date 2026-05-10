/**
 * Top-level wiring. Builds the layout, mounts components, subscribes to
 * the store, and handles cross-cutting events (keyboard, modal lifecycle).
 *
 * Read top-to-bottom: state shape → render → effects.
 */

import { createStore } from './lib/store';
import { buildLayout } from './layouts/IdeLayout';
import { renderTabs } from './components/Tabs';
import { renderToolbar } from './components/ViewToolbar';
import { renderSymbolList } from './components/SymbolList';
import { renderGraph } from './components/GraphView';
import { renderHlil } from './components/HlilView';
import { renderXrefs } from './components/XrefPanel';
import { renderMinimap } from './components/Minimap';
import { renderStatusBar } from './components/StatusBar';
import { createNotifier } from './components/Notification';
import { createProjectsModal } from './components/modals/ProjectsModal';
import { createSetupEnvModal } from './components/modals/SetupEnvModal';
import { createContactModal } from './components/modals/ContactModal';
import { createMainModal } from './components/modals/MainModal';

import { SECTIONS } from './data/sections';
import { SYMBOLS } from './data/symbols';
import type { SectionId, ViewKind } from './types';

interface AppState {
  section: SectionId;
  view: ViewKind;
  query: string;
}

const TAB_LIST: readonly { id: SectionId; label: string }[] = [
  { id: 'main',      label: 'main' },
  { id: 'projects',  label: 'projects' },
  { id: 'setup_env', label: 'setup_env' },
  { id: 'contact',   label: 'contact' },
];

export function bootstrap(host: HTMLElement): void {
  const { root, slots } = buildLayout();
  host.appendChild(root);

  const notifier = createNotifier(slots.notification);
  const store = createStore<AppState>({ section: 'main', view: 'graph', query: '' });

  // ---- Modals ----
  // Closing a modal leaves you on the current page
  const nothing = () => {};

  const modals = {
    main:    createMainModal(nothing),
    projects:  createProjectsModal(nothing),
    setup_env: createSetupEnvModal(nothing),
    contact:   createContactModal({ notifier, onClose: nothing }),
  } as const;
  slots.modals.append(modals.main.root, modals.projects.root, modals.setup_env.root, modals.contact.root);

  let lastSection: SectionId | null = null;

  // ---- Render on state change ----
  const render = (state: AppState) => {
    const section = SECTIONS[state.section];

    renderTabs(slots.tabs, {
      sections: TAB_LIST,
      current: state.section,
      onSelect: (id) => {
        if (state.section === id) {
          if (id in modals && !modals[id as keyof typeof modals].isOpen()) {
            modals[id as keyof typeof modals].open();
          }
        } else {
          store.set({ section: id });
        }
      },
    });

    renderToolbar(slots.toolbar, {
      view: state.view,
      signature: section.signature,
      onView: (v) => store.set({ view: v }),
    });

    renderSymbolList(slots.symbols, {
      symbols: SYMBOLS,
      currentSection: state.section,
      query: state.query,
      onSelectSection: (id) => store.set({ section: id }),
      onClickImport: (name) =>
        notifier.show(`Navigating to ${name}`, 'Function analyzed — no references found.'),
      onQueryChange: (q) => store.set({ query: q }),
    });

    if (state.view === 'graph') {
      slots.graphView.hidden = false;
      slots.hlilView.hidden = true;
      renderGraph(slots.graphView, section);
    } else {
      slots.graphView.hidden = true;
      slots.hlilView.hidden = false;
      renderHlil(slots.hlilView, section);
    }

    renderXrefs(slots.bottomPanel, section);
    renderMinimap(slots.rightPanel, section);
    renderStatusBar(slots.statusbar, section);

    if (state.section !== lastSection) {
      syncModals(state.section);
      lastSection = state.section;
    }
  };

  const syncModals = (section: SectionId) => {
    for (const id of ['main', 'projects', 'setup_env', 'contact'] as const) {
      const shouldOpen = section === id;
      const modal = modals[id];
      if (shouldOpen && !modal.isOpen()) modal.open();
      else if (!shouldOpen && modal.isOpen()) modal.close();
    }
  };

  store.subscribe(render);
  render(store.get());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = (['main', 'projects', 'setup_env', 'contact'] as const).find(
        (id) => modals[id].isOpen(),
      );
      if (open) {
        modals[open].close();
        return;
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      store.set({ view: 'graph' });
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      store.set({ view: 'hlil' });
    }
  });
}