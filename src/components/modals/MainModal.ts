import { el } from '../../lib/dom';
import { createModal, type ModalHandle } from './Modal';

export function createMainModal(onClose: () => void): ModalHandle {
  const profile = el('div', { class: 'about-profile' }, [
    el('img', {
      class: 'about-avatar',
      attrs: {
        src: 'pfp.png', // replace with your actual path
        alt: 'Profile picture',
      },
    }),

    el('div', { class: 'about-content' }, [
      el('h2', {
        html: `<span class="kw">#include</span> <span class="str">"whoami.h"</span>`,
      }),

      el('p', {
        class: 'about-text',
        html: `
          hi, I'm <span class="kw">0xHe1mdall</span>.<br>
          I build low-level software, reverse engineer stuff,
          and make weird tools for fun.
        `,
      }),

      el('div', { class: 'about-tags' }, [
        el('span', { class: 'about-tag', text: 'C' }),
        el('span', { class: 'about-tag', text: 'C++' }),
        el('span', { class: 'about-tag', text: 'Reverse Engineering' }),
        el('span', { class: 'about-tag', text: 'Systems' }),
        el('span', { class: 'about-tag', text: 'Web' }),
      ]),
    ]),
  ]);

  const footer = el('footer', { class: 'modal-footer' }, [
    el('button', {
      class: 'modal-btn',
      attrs: { type: 'button' },
      text: 'return 0;',
      on: { click: () => modal.close() },
    }),
  ]);

  const body = el('div', { class: 'about-wrapper' }, [profile]);

  const modal = createModal({
    id: 'modal-main',
    title: `int32_t main(void) — <span class="cmt">// who am I?</span>`,
    body,
    footer,
    onClose,
  });

  return modal;
}