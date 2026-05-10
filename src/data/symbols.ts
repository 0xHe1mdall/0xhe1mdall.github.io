import type { Symbol_ } from '../types';

/**
 * Left-panel symbol list. Function symbols link to a section; imports are
 * decorative (they trigger a "no references" notification when clicked).
 */
export const SYMBOLS: readonly Symbol_[] = [
  { name: 'main',            kind: 'func', section: 'main' },
  { name: 'projects',        kind: 'func', section: 'projects' },
  { name: 'setup_env',       kind: 'func', section: 'setup_env' },
  { name: 'contact',         kind: 'func', section: 'contact' },
  { name: 'printf',          kind: 'import' },
  { name: 'alloc_projects',  kind: 'import' },
  { name: 'add',             kind: 'import' },
  { name: 'list_len',        kind: 'import' },
  { name: 'render_projects', kind: 'import' },
  { name: 'load_os',         kind: 'import' },
  { name: 'install_tool',    kind: 'import' },
  { name: 'set_lang',        kind: 'import' },
  { name: 'open_channel',    kind: 'import' },
  { name: 'send_message',    kind: 'import' },
  { name: 'load_projects',   kind: 'import' },
];
