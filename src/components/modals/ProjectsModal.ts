import { el } from '../../lib/dom';
import { createModal, type ModalHandle } from './Modal';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../types';

export function createProjectsModal(onClose: () => void): ModalHandle {
  const cards = PROJECTS.map(buildCard);
  const body = el('div', {}, [
    el('h2', {
      html: `<span class="kw">struct</span> <span class="ty">ProjectList</span> <span class="lbl">projects</span> = {`,
    }),
    ...cards,
  ]);

  const footer = el('footer', { class: 'modal-footer' }, [
    el('button', {
      class: 'modal-btn',
      attrs: { type: 'button' },
      text: '; // close',
      on: { click: () => modal.close() },
    }),
  ]);

  const modal = createModal({
    id: 'modal-projects',
    title: `int32_t projects(void) — <span class="cmt">// project listing</span>`,
    body,
    footer,
    onClose,
  });
  return modal;
}

function buildCard(p: Project): HTMLElement {
  const tagEls = p.tags.map(t =>
    el('span', { class: 'tag lang', text: t }),
  );
  const statusClass = p.status === 'stable' ? 'tag status-done' : 'tag status-wip';
  tagEls.push(el('span', { class: statusClass, text: p.status === 'stable' ? 'stable' : 'wip' }));

  return el('article', { class: 'project-card' }, [
    el('h3', { class: 'project-card-title', text: p.title }),
    el('p', { class: 'project-card-desc', text: p.description }),
    el('div', { class: 'project-tags' }, tagEls),
  ]);
}
