/**
 * Contact modal with a working mailto: form (no backend needed for GH Pages).
 * Social buttons are real anchor tags so they're keyboard-focusable and
 * middle-clickable.
 */

import { el } from '../../lib/dom';
import { createModal, type ModalHandle } from './Modal';
import { PROFILE } from '../../data/profile';
import type { Notifier } from '../Notification';

interface CreateContactModalDeps {
  notifier: Notifier;
  onClose: () => void;
}

export function createContactModal({ notifier, onClose }: CreateContactModalDeps): ModalHandle {
  const nameInput = el('input', {
    class: 'modal-input',
    attrs: {
      type: 'text',
      placeholder: 'char* name = ...',
      'aria-label': 'Your name',
      name: 'name',
      autocomplete: 'name',
    },
  }) as HTMLInputElement;

  const emailInput = el('input', {
    class: 'modal-input',
    attrs: {
      type: 'email',
      placeholder: 'char* email = ...',
      'aria-label': 'Your email',
      name: 'email',
      autocomplete: 'email',
    },
  }) as HTMLInputElement;

  const messageInput = el('textarea', {
    class: 'modal-textarea',
    attrs: {
      placeholder: '// write your message here...',
      'aria-label': 'Your message',
      name: 'message',
    },
  }) as HTMLTextAreaElement;

  const social = el(
    'div',
    { class: 'modal-actions' },
    PROFILE.social.map(s => {
      const cls =
        s.variant === 'kw' ? 'modal-btn kw'
        : s.variant === 'green' ? 'modal-btn green'
        : 'modal-btn';
      return el('a', {
        class: cls,
        attrs: {
          href: s.href,
          target: s.label === 'email' ? '_self' : '_blank',
          rel: 'noopener noreferrer',
        },
        text: s.label,
      });
    }),
  );

  const body = el('div', {}, [
    field('// name', nameInput),
    field('// email', emailInput),
    field('// message', messageInput),
    social,
  ]);

  const sendBtn = el('button', {
    class: 'modal-btn',
    attrs: { type: 'submit' },
    text: 'send_message()',
  });

  const form = el('form', { attrs: { novalidate: '' } }, [body, el('footer', { class: 'modal-footer' }, [sendBtn])]);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitMailto(nameInput.value, emailInput.value, messageInput.value);
    notifier.show('Message queued', 'Your mail client has been opened with your message.');
    modal.close();
  });

  const modal = createModal({
    id: 'modal-contact',
    title: `void contact(<span class="pm">char* message</span>) — <span class="cmt">// send a message</span>`,
    body: form,
    onClose,
  });
  return modal;
}

function field(label: string, input: HTMLElement): HTMLElement {
  return el('div', { class: 'modal-field' }, [
    el('label', { class: 'modal-label', text: label }),
    input,
  ]);
}

function submitMailto(name: string, email: string, message: string): void {
  const target = findEmail();
  const subject = `Portfolio contact${name ? ` — ${name}` : ''}`;
  const body = [
    name ? `From: ${name}` : null,
    email ? `Reply-to: ${email}` : null,
    '',
    message,
  ].filter(Boolean).join('\n');
  window.location.href = `mailto:${target}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function findEmail(): string {
  const link = PROFILE.social.find(s => s.label === 'email');
  return link?.href.replace(/^mailto:/, '') ?? '';
}
