/**
 * Minimal DOM helpers. Not a framework — just enough to write components
 * declaratively without inline `onclick=""` attributes.
 *
 * Total size: ~30 lines. Replace with a framework only if the app's
 * complexity actually demands it (it doesn't).
 */

type EventMap = HTMLElementEventMap & SVGElementEventMap;

type Children = string | Node | null | undefined | false | (string | Node | null | undefined | false)[];

export interface ElProps {
  class?: string;
  id?: string;
  text?: string;
  /** Set as innerHTML — only use with content you produced yourself. */
  html?: string;
  attrs?: Record<string, string | number | boolean | null | undefined>;
  on?: Partial<{
    [K in keyof EventMap]: (ev: EventMap[K]) => void;
  }>;
  children?: Children;
}

/** Create an element with attributes, listeners, and children in one call. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElProps = {},
  children?: Children,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (props.class) node.className = props.class;
  if (props.id) node.id = props.id;
  if (props.text != null) node.textContent = props.text;
  if (props.html != null) node.innerHTML = props.html;
  if (props.attrs) {
    for (const [k, v] of Object.entries(props.attrs)) {
      if (v == null || v === false) continue;
      node.setAttribute(k, v === true ? '' : String(v));
    }
  }
  if (props.on) {
    for (const [k, fn] of Object.entries(props.on)) {
      if (fn) node.addEventListener(k, fn as EventListener);
    }
  }
  appendChildren(node, props.children ?? children);
  return node;
}

function appendChildren(parent: Node, children: Children): void {
  if (children == null || children === false) return;
  if (Array.isArray(children)) {
    for (const c of children) appendChildren(parent, c);
    return;
  }
  if (typeof children === 'string') {
    parent.appendChild(document.createTextNode(children));
    return;
  }
  parent.appendChild(children);
}

/** Query selector with a typed return. Throws if not found. */
export function qs<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T {
  const node = root.querySelector<T>(sel);
  if (!node) throw new Error(`qs: element not found for selector "${sel}"`);
  return node;
}

/** Replace the children of `parent` with `node` (or remove all if null). */
export function mount(parent: Element, node: Node | null): void {
  parent.replaceChildren(...(node ? [node] : []));
}

/** Escape arbitrary text for safe interpolation into innerHTML strings. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
