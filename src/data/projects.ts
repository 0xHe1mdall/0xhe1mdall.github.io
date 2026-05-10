import type { Project } from '../types';

/**
 * Project list — single source of truth. The HLIL view, projects modal, and
 * graph blocks are all generated from this array. Add a project here and it
 * appears everywhere.
 */
export const PROJECTS: readonly Project[] = [
  {
    title: 'kread_cs2',
    description:
      'Kernel driver exposing a character device that user-mode processes can read from to receive real-time game state updates from Counter-Strike 2. Features a Python-based GUI/render layer built on a modified version of PyMeow for custom overlays and debugging tools.',
    tags: ['C', 'C++', 'Python', 'Counter-Strike 2'],
    status: 'wip',
  },
  {
    title: 'c_vision',
    description:
      'Developed a high-performance OCR and real-time visual analysis tool in C capable of detecting specific colors, shapes, and on-screen patterns with minimal latency. Designed for game-assisted automation and rapid decision support, featuring optimized frame processing, pixel scanning, and lightweight pattern recognition routines.',
    tags: ['C', 'Computer Vision', 'Real-Time Systems'],
    status: 'stable',
  },
  {
    title: 'cafeyn_ripper (private)' ,
    description:
      'Complete content extraction suite for cafeyn.com, a digital newsstand platform. The interface is built with TypeScript and Node.js, orchestrating a Python backend responsible for DRM bypassing, content processing, and automated delivery workflows. Supports authentication, subscription handling, metadata parsing, and high-performance downloading of protected books and magazines.',
    tags: ['Vue.js', 'TypeScript', 'JavaScript' ,'Python'],
    status: 'stable',
  },
  {
    title: 'kernel_driver_edr_bypass (private)',
    description:
      'Windows kernel driver leveraging NTAPI undocumented functions to intercept and manipulate driver dispatch handlers. Custom IRP routing, process hiding via DKOM, and real-time syscall hooking.',
    tags: ['C', 'WDK', 'NTAPI'],
    status: 'stable',
  },
  {
    title: 'kagane_downloader',
    description:
      'Complete Python CLI tool for downloading media files from kagane.org. Implements efficient CloudFlare bypassing and concurrent downloading.',
    tags: ['Python', 'CLI'],
    status: 'stable',
  },
];
