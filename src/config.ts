/** Tunable constants. Centralized so future you doesn't have to grep. */

export const CONFIG = {
  /** Block dimensions used for both rendering and edge geometry. */
  block: {
    width: 260,
    /** Header (~26px) + per-line height (~20px) + bottom padding (~10px) */
    headerHeight: 26,
    lineHeight: 20,
    bottomPadding: 10,
    verticalPadding: 8, 
  },
  /** Notification toast visibility duration */
  notifMs: 3200,
  /** Below this viewport width, the IDE shell collapses (see responsive.css) */
  mobileBreakpoint: 900,

  
} as const;

export const blockHeight = (lineCount: number): number =>
  CONFIG.block.headerHeight +
  lineCount * CONFIG.block.lineHeight +
  CONFIG.block.verticalPadding;