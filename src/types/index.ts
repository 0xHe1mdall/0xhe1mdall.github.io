/**
 * Shared type definitions used across data + components.
 * Editing the data files (src/data/*) is type-checked against these.
 */

export type SectionId = 'main' | 'projects' | 'setup_env' | 'contact';

export type ViewKind = 'graph' | 'hlil';

/** A line of code rendered inside a CFG block. `[lineNumber, html]`. */
export type BlockLine = readonly [number | string, string];

export type BlockBadge = 'entry' | 'exit' | null;

export interface CfgBlock {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly label: string; // address e.g. '0x4013a0'
  readonly badge: BlockBadge;
  /** Optional decoration on the block (true/false exit border) */
  readonly exit?: 'true' | 'false';
  readonly lines: readonly BlockLine[];
}

export type EdgeKind = 'true' | 'false' | 'normal';

export interface CfgEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: EdgeKind;
}

export interface Xref {
  readonly fn: string;
  readonly addr: string;
  readonly arrow: '←' | '→';
}

export interface HlilLine {
  readonly n: number;
  readonly indent: 0 | 1 | 2 | 3;
  readonly code: string; // pre-built highlighted HTML
}

export interface Section {
  readonly id: SectionId;
  /** Highlighted function signature for the toolbar */
  readonly signature: string;
  readonly fnName: string;
  readonly statusAddr: string;
  readonly statusInfo: string;
  readonly xrefs: readonly Xref[];
  readonly graph: readonly CfgBlock[];
  readonly edges: readonly CfgEdge[];
  readonly hlil: readonly HlilLine[];
  /** Whether this section opens a modal when activated */
  readonly modal?: 'projects' | 'setup_env' | 'contact';
}

export type SymbolKind = 'func' | 'import';

export interface Symbol_ {
  readonly name: string;
  readonly kind: SymbolKind;
  /** Section this symbol jumps to when clicked. Imports have none. */
  readonly section?: SectionId;
}

export type ProjectStatus = 'stable' | 'wip';

export interface Project {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly status: ProjectStatus;
}

export interface SkillGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface SocialLink {
  readonly label: 'github' | 'discord' | 'email';
  readonly href: string;
  readonly variant: 'default' | 'kw' | 'green';
}

export interface Profile {
  readonly handle: string;
  readonly country: string;
  readonly social: readonly SocialLink[];
}
