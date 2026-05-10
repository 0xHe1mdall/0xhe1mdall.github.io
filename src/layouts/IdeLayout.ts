/**
 * The IDE shell. Hosts the tabs bar, view toolbar, the three-column main
 * area (left symbols, content, right minimap), the bottom xref panel, and
 * the status bar. Components mount into the slots defined here.
 */

import { el } from '../lib/dom';

export interface LayoutSlots {
  tabs: HTMLElement;
  toolbar: HTMLElement;
  symbols: HTMLElement;
  graphView: HTMLElement;
  hlilView: HTMLElement;
  bottomPanel: HTMLElement;
  rightPanel: HTMLElement;
  statusbar: HTMLElement;
  notification: HTMLElement;
  modals: HTMLElement;
}

export function buildLayout(): { root: HTMLElement; slots: LayoutSlots } {
  const tabs = el('div', { class: 'tabs-bar', attrs: { role: 'tablist' } });
  const toolbar = el('div', { class: 'view-toolbar' });
  const symbols = el('aside', { class: 'left-panel', attrs: { 'aria-label': 'Symbols' } });
  const graphView = el('section', { class: 'graph-view', attrs: { 'aria-label': 'Control flow graph' } });
  const hlilView = el('section', { class: 'hlil-view', attrs: { 'aria-label': 'High level IL', hidden: true } });
  const bottomPanel = el('div', { class: 'bottom-panel', attrs: { 'aria-label': 'Cross references' } });
  const rightPanel = el('aside', { class: 'right-panel', attrs: { 'aria-label': 'Overview' } });
  const statusbar = el('footer', { class: 'statusbar', attrs: { role: 'status' } });
  const notification = el('div', {
    class: 'notification',
    attrs: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' },
  });
  const modals = el('div', { class: 'modals' });

  const contentArea = el('div', { class: 'content-area' }, [graphView, hlilView, bottomPanel]);

  const main = el('div', { class: 'main-layout' }, [symbols, contentArea, rightPanel]);

  const root = el(
    'div',
    { class: 'ide-shell', attrs: { style: 'display:contents' } },
    [tabs, toolbar, main, statusbar, notification, modals],
  );

  return {
    root,
    slots: { tabs, toolbar, symbols, graphView, hlilView, bottomPanel, rightPanel, statusbar, notification, modals },
  };
}
