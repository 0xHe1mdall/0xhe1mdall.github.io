/**
 * Tiny syntax-highlight helper.
 *
 * The original code embedded `<span class="kw">…</span>` tags directly inside
 * data strings, which is fragile and unreadable. This module exposes:
 *
 *   1. `c\`...\`` — a tagged template that highlights C-like pseudocode using
 *      the BN syntax classes (.kw .ty .fn .str .num .cmt .op .pm .addr .lbl).
 *   2. Single-token helpers (`kw`, `ty`, `fn`, …) for cases the regex misses.
 *
 * The output is plain HTML strings — components inject them via `innerHTML`
 * the same way the original did, but data files stay clean.
 */

import { escapeHtml } from './dom';

const KEYWORDS = new Set([
  'int32_t', 'void', 'char', 'if', 'else', 'return', 'goto', 'struct',
  'NULL', 'true', 'false', '#include',
]);
const TYPES = new Set([
  'int32_t', 'char', 'char*', 'char**', 'ProjectList', 'ProjectList*',
]);

/** Wrap a string in a highlight span. The content is HTML-escaped. */
const span = (cls: string, txt: string) => `<span class="${cls}">${escapeHtml(txt)}</span>`;

export const kw   = (s: string) => span('kw', s);
export const ty   = (s: string) => span('ty', s);
export const fn   = (s: string) => span('fn', s);
export const str  = (s: string) => `<span class="str">"${escapeHtml(s)}"</span>`;
export const num  = (s: string | number) => span('num', String(s));
export const cmt  = (s: string) => span('cmt', s);
export const op   = (s: string) => span('op', s);
export const pm   = (s: string) => span('pm', s);
export const addr = (s: string) => span('addr', s);
export const lbl  = (s: string) => span('lbl', s);

/**
 * Tagged template: highlights a line of C-like pseudocode.
 * Interpolated values are HTML-escaped — they render as plain text.
 *
 *   c`if (${argc} > 1) goto hello_world`
 *
 * Recognized tokens (in order):
 *   - line comments     // ...
 *   - strings           "..."
 *   - keywords          int32_t, void, if, else, return, goto, struct, NULL, #include
 *   - hex numbers       0x...
 *   - decimal numbers   123
 *   - addresses         label-like 0x401... already covered by hex
 *   - identifiers ending with `(` → fn (function call)
 *   - operators         = == != > < + - && ||
 *
 * Anything unmatched stays as plain text. The grammar is intentionally tiny:
 * just enough to make the data files readable.
 */
export function c(strings: TemplateStringsArray, ...values: unknown[]): string {
  // Re-assemble the template, escaping interpolated values.
  let raw = '';
  strings.forEach((s, i) => {
    raw += s;
    if (i < values.length) raw += escapeHtml(String(values[i]));
  });
  return tokenize(raw);
}

const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*)',                 // 1: line comment
    '("(?:[^"\\\\]|\\\\.)*")',         // 2: string
    '(0x[0-9a-fA-F]+)',                // 3: hex number
    '(\\b\\d+\\b)',                    // 4: decimal number
    '(#?\\b[A-Za-z_][A-Za-z0-9_]*\\*{0,2})(\\s*\\()?', // 5: identifier (+ 6: optional opening paren)
    '(==|!=|<=|>=|&&|\\|\\||->|[=+\\-<>])',           // 7: operator
  ].join('|'),
  'g',
);

function tokenize(raw: string): string {
  // We escaped interpolations already, but the template literal contents are raw.
  // Strings/comments contain user-written characters that need final escaping.
  // Strategy: walk tokens; for unmatched gaps, emit escaped text.
  let out = '';
  let last = 0;
  for (const m of raw.matchAll(TOKEN_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out += escapeHtml(raw.slice(last, idx));

    const [whole, mComment, mString, mHex, mDec, mIdent, mOpenParen, mOp] = m;
    if (mComment != null) {
      out += `<span class="cmt">${escapeHtml(mComment)}</span>`;
    } else if (mString != null) {
      out += `<span class="str">${escapeHtml(mString)}</span>`;
    } else if (mHex != null) {
      out += `<span class="addr">${escapeHtml(mHex)}</span>`;
    } else if (mDec != null) {
      out += `<span class="num">${escapeHtml(mDec)}</span>`;
    } else if (mIdent != null) {
      const cls = classifyIdent(mIdent, !!mOpenParen);
      out += `<span class="${cls}">${escapeHtml(mIdent)}</span>${mOpenParen ?? ''}`;
    } else if (mOp != null) {
      out += `<span class="op">${escapeHtml(mOp)}</span>`;
    } else {
      out += escapeHtml(whole);
    }
    last = idx + whole.length;
  }
  if (last < raw.length) out += escapeHtml(raw.slice(last));
  return out;
}

function classifyIdent(id: string, callLike: boolean): string {
  const stripped = id.replace(/\*+$/, '');
  if (KEYWORDS.has(stripped) || id.startsWith('#')) return 'kw';
  if (TYPES.has(id) || TYPES.has(stripped)) return 'ty';
  if (callLike) return 'fn';
  // Bare identifier — treat as label/variable
  return 'lbl';
}
