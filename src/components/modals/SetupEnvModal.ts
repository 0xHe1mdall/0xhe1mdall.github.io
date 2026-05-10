import { el } from '../../lib/dom';
import { createModal, type ModalHandle } from './Modal';
import { SKILLS } from '../../data/skills';

export function createSetupEnvModal(onClose: () => void): ModalHandle {
  const groups = SKILLS.map(g =>
    el('div', { class: 'skill-group' }, [
      el('div', { class: 'skill-group-title', text: g.title }),
      ...g.items.map(item => el('div', { class: 'skill-item', text: item })),
    ]),
  );

  const body = el('div', {}, [
    el('h2', {
      html: `<span class="kw">#include</span> <span class="str">"dev_environment.h"</span>`,
    }),
    el('div', { class: 'skills-grid' }, groups),
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
    id: 'modal-setup_env',
    title: `void setup_env(void) — <span class="cmt">// dev environment</span>`,
    body,
    footer,
    onClose,
  });
  return modal;
}
