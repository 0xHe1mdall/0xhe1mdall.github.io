import type { Section, SectionId } from '../types';
import { c, kw, ty, fn, pm, cmt } from '../lib/highlight';

/**
 * Per-section content: function signature, status info, xrefs, graph
 * (control-flow blocks + edges), and HLIL pseudocode.
 *
 * Graph block coordinates are hand-placed for the desired Binary Ninja
 * layout — left/right branching, then merging. Don't edit blindly.
 */

const sigMain     = `${kw('int32_t')} ${fn('main')}(${ty('int32_t')} ${pm('argc')}, ${ty('char**')} ${pm('argv')}, ${ty('char**')} ${pm('envp')})`;
const sigProjects = `${kw('int32_t')} ${fn('projects')}(${kw('void')})`;
const sigSetupEnv = `${kw('void')} ${fn('setup_env')}(${kw('void')})`;
const sigContact  = `${kw('void')} ${fn('contact')}(${ty('char*')} ${pm('message')})`;

const main: Section = {
  id: 'main',
  signature: sigMain,
  fnName: 'main',
  statusAddr: '0x4013a0',
  statusInfo: '4 blocks • 0x4013a0–0x4013f8',
  xrefs: [{ fn: '_start', addr: '0x401588', arrow: '←' }],
  graph: [
    {
      id: 'b0', x: 320, y: 40, label: '0x4013a0', badge: 'entry',
      lines: [
        [40, c`int32_t result = 0`],
        [41, c`char* name    = "0xHe1mdall"`],
        [42, c`int32_t country    = 0xFA0000`],
        [43, c`if (argc > 1) goto hello_world`],
      ],
    },
    {
      id: 'b1', x: 80, y: 240, label: '0x4013b8', badge: null,
      lines: [
        [50, c`printf("Hello, World!")`],
        [51, c`result = 1`],
        [52, c`goto setup_env`],
      ],
    },
    {
      id: 'b2', x: 500, y: 240, label: '0x4013c4', badge: null, exit: 'true',
      lines: [
        [60, cmt('// hello_world:')],
        [61, c`setup_env()`],
        [62, c`load_projects()`],
        [63, c`if (result == 0)`],
      ],
    },
    {
      id: 'b3', x: 300, y: 460, label: '0x4013f0', badge: 'exit',
      lines: [
        [70, c`contact("hire_me")`],
        [71, c`return result`],
      ],
    },
  ],
  edges: [
    { from: 'b0', to: 'b1', kind: 'false' },
    { from: 'b0', to: 'b2', kind: 'true'  },
    { from: 'b1', to: 'b3', kind: 'normal' },
    { from: 'b2', to: 'b3', kind: 'normal' },
  ],
  hlil: [
    { n:  1, indent: 0, code: sigMain },
    { n:  2, indent: 0, code: '{' },
    { n:  3, indent: 1, code: c`int32_t result  = 0` },
    { n:  4, indent: 1, code: c`char*   name    = "0xHe1mdall"` },
    { n:  5, indent: 1, code: c`int32_t   country    = 0xFA0000` },
    { n:  6, indent: 1, code: cmt('// navigate the binary to discover who I am') },
    { n:  7, indent: 1, code: c`if (argc > 1)` },
    { n:  8, indent: 1, code: '{' },
    { n:  9, indent: 2, code: `${c`setup_env()`}   ${cmt('// load dev environment')}` },
    { n: 10, indent: 2, code: `${c`projects()`}    ${cmt('// browse projects')}` },
    { n: 11, indent: 1, code: '}' },
    { n: 12, indent: 1, code: kw('else') },
    { n: 13, indent: 1, code: '{' },
    { n: 14, indent: 2, code: c`printf("Hello! Click a function in Symbols →")` },
    { n: 15, indent: 2, code: c`result = 1` },
    { n: 16, indent: 1, code: '}' },
    { n: 17, indent: 1, code: `${c`contact("hire_me")`}  ${cmt('// always open')}` },
    { n: 18, indent: 1, code: c`return result` },
    { n: 19, indent: 0, code: '}' },
  ],
};

const projects: Section = {
  id: 'projects',
  signature: sigProjects,
  fnName: 'projects',
  statusAddr: '0x401600',
  statusInfo: '3 blocks • 0x401600–0x40165c',
  xrefs: [
    { fn: 'main',      addr: '0x4013c2', arrow: '←' },
    { fn: 'setup_env', addr: '0x4015aa', arrow: '←' },
  ],
  graph: [
    {
      id: 'p0', x: 300, y: 40, label: '0x401600', badge: 'entry',
      lines: [
        [1, c`ProjectList* list = alloc_projects()`],
        [2, c`add(list, "kread_cs2")`],
        [3, c`add(list, "c_vision")`],
        [4, c`add(list, "cafeyn_ripper")`],
        [5, c`if (list_len(list) > 3) goto more`],
      ],
    },
    {
      id: 'p1', x: 80, y: 280, label: '0x401630', badge: null,
      lines: [
        [10, c`add(list, "kernel_driver_edr_bypass")`],
        [11, c`add(list, "kagane_downloader")`],
      ],
    },
    {
      id: 'p2', x: 300, y: 420, label: '0x40164e', badge: 'exit',
      lines: [
        [20, c`render_projects(list)`],
        [21, c`return list_len(list)`],
      ],
    },
  ],
  edges: [
    { from: 'p0', to: 'p1', kind: 'true' },
    { from: 'p0', to: 'p2', kind: 'false' },
    { from: 'p1', to: 'p2', kind: 'normal' },
  ],
  // HLIL is built procedurally from the projects data so it can never drift
  // out of sync with the modal cards.
  hlil: buildProjectsHlil(),
  modal: 'projects',
};

const setupEnv: Section = {
  id: 'setup_env',
  signature: sigSetupEnv,
  fnName: 'setup_env',
  statusAddr: '0x401500',
  statusInfo: '2 blocks • 0x401500–0x401560',
  xrefs: [{ fn: 'main', addr: '0x4013c5', arrow: '←' }],
  graph: [
    {
      id: 's0', x: 280, y: 50, label: '0x401500', badge: 'entry',
      lines: [
        [1, c`load_os("Windows 11")`],
        [2, c`load_os("Linux/Debian")`],
        [3, c`install_tool("VS Code / Zed")`],
        [4, c`install_tool("Binary Ninja")`],
        [5, c`install_tool("Docker")`],
      ],
    },
    {
      id: 's1', x: 280, y: 300, label: '0x401540', badge: 'exit',
      lines: [
        [10, c`set_lang("C/C++")`],
        [11, c`set_lang("TypeScript")`],
        [12, c`set_lang("Python")`],
        [13, c`return`],
      ],
    },
  ],
  edges: [{ from: 's0', to: 's1', kind: 'normal' }],
  hlil: [
    { n:  1, indent: 0, code: sigSetupEnv },
    { n:  2, indent: 0, code: '{' },
    { n:  3, indent: 1, code: cmt('// === OS ===') },
    { n:  4, indent: 1, code: c`load_os("Windows 11")` },
    { n:  5, indent: 1, code: c`load_os("Linux / Debian")` },
    { n:  6, indent: 1, code: cmt('// === Tools ===') },
    { n:  7, indent: 1, code: c`install("VS Code / Zed")` },
    { n:  8, indent: 1, code: c`install("Binary Ninja")` },
    { n: 9, indent: 1, code: c`install("Docker")` },
    { n: 10, indent: 1, code: c`install("WinDbg / x64dbg")` },
    { n: 11, indent: 1, code: cmt('// === Languages ===') },
    { n: 12, indent: 1, code: c`set_lang("C / C++",      "systems + kernel")` },
    { n: 13, indent: 1, code: c`set_lang("TypeScript",   "frontend + backend")` },
    { n: 14, indent: 1, code: c`set_lang("Python",       "async + scripting")` },
    { n: 15, indent: 1, code: c`set_lang("Java",         "game servers")` },
    { n: 16, indent: 1, code: c`set_lang("HLSL / GLSL",  "shaders")` },
    { n: 17, indent: 1, code: c`return` },
    { n: 18, indent: 0, code: '}' },
  ],
  modal: 'setup_env',
};

const contact: Section = {
  id: 'contact',
  signature: sigContact,
  fnName: 'contact',
  statusAddr: '0x401700',
  statusInfo: '2 blocks • 0x401700–0x401740',
  xrefs: [{ fn: 'main', addr: '0x4013f2', arrow: '←' }],
  graph: [
    {
      id: 'c0', x: 280, y: 50, label: '0x401700', badge: 'entry',
      lines: [
        [1, c`open_channel("discord")`],
        [2, c`open_channel("github")`],
        [3, c`open_channel("email")`],
        [4, c`if (message != NULL)`],
      ],
    },
    {
      id: 'c1', x: 280, y: 310, label: '0x401730', badge: 'exit',
      lines: [
        [10, c`send_message(message)`],
        [11, c`return`],
      ],
    },
  ],
  edges: [{ from: 'c0', to: 'c1', kind: 'normal' }],
  hlil: [
    { n:  1, indent: 0, code: sigContact },
    { n:  2, indent: 0, code: '{' },
    { n:  3, indent: 1, code: cmt('// always open to opportunities') },
    { n:  4, indent: 1, code: c`open_channel("discord")` },
    { n:  5, indent: 1, code: c`open_channel("github")` },
    { n:  6, indent: 1, code: c`open_channel("email")` },
    { n:  7, indent: 1, code: c`if (message != NULL)` },
    { n:  8, indent: 1, code: '{' },
    { n:  9, indent: 2, code: c`send_message(message)` },
    { n: 10, indent: 1, code: '}' },
    { n: 11, indent: 1, code: c`return` },
    { n: 12, indent: 0, code: '}' },
  ],
  modal: 'contact',
};

export const SECTIONS: Readonly<Record<SectionId, Section>> = {
  main,
  projects,
  setup_env: setupEnv,
  contact,
};

/* --- helpers --- */

import { PROJECTS } from './projects';

function buildProjectsHlil() {
  const out: { n: number; indent: 0 | 1 | 2 | 3; code: string }[] = [
    { n: 1, indent: 0, code: sigProjects },
    { n: 2, indent: 0, code: '{' },
    { n: 3, indent: 1, code: c`ProjectList* list = alloc_projects()` },
  ];
  let n = 4;
  for (const p of PROJECTS) {
    const tagSummary = p.tags.join(', ');
    out.push({
      n: n++, indent: 1,
      code: `${c`add(list, "${p.title}")`}   ${cmt(`// ${tagSummary}`)}`,
    });
  }
  out.push({ n: n++, indent: 1, code: `${c`return list_len(list)`}  ${cmt(`// ${PROJECTS.length}`)}` });
  out.push({ n: n,   indent: 0, code: '}' });
  return out;
}
