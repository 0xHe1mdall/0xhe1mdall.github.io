import type { SkillGroup } from '../types';

/**
 * Skill groups shown in the setup_env modal. Edit to update both the modal
 * and the HLIL view (which is generated from this list).
 */
export const SKILLS: readonly SkillGroup[] = [
  {
    title: '// OS & Tools',
    items: [
      'Windows 11 / Linux',
      'VS Code / Zed',
      'Binary Ninja',
      'IDA Pro',
      'Git / GitHub',
      'Docker',
      'WinDbg / x64dbg',
    ],
  },
  {
    title: '// Languages',
    items: [
      'C / C++ (systems)',
      'C#',
      'Python (async)',
      'TypeScript / JS',
    ],
  },
  {
    title: '// Frameworks',
    items: [
      'Vue 3 + Pinia',
      'FastAPI / Express',
      'WDK (kernel)',
      'NTAPI / Win32',
    ],
  },
  {
    title: '// Expertise',
    items: [
      'Kernel drivers',
      'RE & binary analysis',
      'API architecture',
      'Game modding',
    ],
  },
];
