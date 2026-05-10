/**
 * Renders the control-flow graph for a section.
 *
 * Edge geometry is computed from data (block.x, block.y, lineCount), not from
 * `getBoundingClientRect()` like the original. This eliminates the
 * requestAnimationFrame race and works correctly under zoom/scroll.
 */

import { el, mount } from '../lib/dom';
import type { CfgBlock, CfgEdge, EdgeKind, Section } from '../types';
import { CONFIG, blockHeight } from '../config';

const EDGE_COLOR: Record<EdgeKind, string> = {
  true:   'var(--edge-true)',
  false:  'var(--edge-false)',
  normal: 'var(--edge-normal)',
};

export function renderGraph(host: HTMLElement, section: Section): void {
  const blocks = section.graph;
  const edges = section.edges;

  const maxX = Math.max(...blocks.map(b => b.x + CONFIG.block.width));
  const maxY = Math.max(...blocks.map(b => b.y + blockHeight(b.lines.length)));

  const totalW = maxX + 80;
  const totalH = maxY + 80;

  const blockEls = blocks.map(buildBlock);

  const canvas = el(
    'div',
    {
      class: 'graph-canvas',
      attrs: { style: `min-width:${totalW}px;min-height:${totalH}px` },
    },
    blockEls,
  );

  mount(host, canvas);

  const svg = buildSvg(blocks, edges, totalW, totalH);
  canvas.prepend(svg);
}

function buildBlock(b: CfgBlock): HTMLElement {
  const lines = b.lines.map(([n, html]) =>
    el('div', { class: 'block-line' }, [
      el('span', { class: 'line-num', text: String(n) }),
      el('span', { class: 'line-code', html }),
    ]),
  );

  const exitClass = b.exit === 'true' ? ' exit-true' : b.exit === 'false' ? ' exit-false' : '';

  return el(
    'div',
    {
      class: `cfg-block${exitClass}`,
      id: `block-${b.id}`,
      attrs: { style: `left:${b.x}px;top:${b.y}px;width:${CONFIG.block.width}px` },
    },
    [
      el('div', { class: 'block-header' }, [
        el('span', { class: 'block-addr', text: b.label }),
        b.badge ? el('span', { class: `block-badge ${b.badge}`, text: b.badge }) : null,
      ]),
      el('div', { class: 'block-lines' }, lines),
    ],
  );
}

function buildSvg(
  blocks: readonly CfgBlock[],
  edges: readonly CfgEdge[],
  width: number,
  height: number,
): SVGSVGElement {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(SVG_NS, 'svg');

  svg.setAttribute('class', 'cfg-svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('aria-hidden', 'true');

  // Arrow markers
  const defs = document.createElementNS(SVG_NS, 'defs');
  for (const kind of ['true', 'false', 'normal'] as EdgeKind[]) {
    defs.appendChild(buildArrowMarker(kind));
  }
  svg.appendChild(defs);

  const blockMap = new Map(blocks.map(b => [b.id, b]));

  const padding = 0;

  const EDGE_OFFSET = 6;

  for (const edge of edges) {
    const from = blockMap.get(edge.from);
    const to = blockMap.get(edge.to);

    if (!from || !to) continue;

    const fromEl = document.getElementById(
      `block-${from.id}`,
    ) as HTMLElement | null;

    const toEl = document.getElementById(
      `block-${to.id}`,
    ) as HTMLElement | null;

    if (!fromEl || !toEl) continue;

    // Anchor: bottom-center of source block
    const x1 = padding + from.x + CONFIG.block.width / 2;
    const y1 = padding + from.y + fromEl.offsetHeight + EDGE_OFFSET;

    // Anchor: top-center of target block
    const x2 = padding + to.x + CONFIG.block.width / 2;
    const y2 = padding + to.y - EDGE_OFFSET;

    // Smooth cubic curve
    const cy = (y1 + y2) / 2;

    const path = document.createElementNS(SVG_NS, 'path');

    path.setAttribute(
      'd',
      `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`,
    );

    path.setAttribute('stroke', EDGE_COLOR[edge.kind]);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('opacity', '0.7');
    path.setAttribute('marker-end', `url(#arrow-${edge.kind})`);

    svg.appendChild(path);
  }

  return svg;
}

function buildArrowMarker(kind: EdgeKind): SVGMarkerElement {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const marker = document.createElementNS(SVG_NS, 'marker');
  marker.setAttribute('id', `arrow-${kind}`);
  marker.setAttribute('markerWidth', '6');
  marker.setAttribute('markerHeight', '6');
  marker.setAttribute('refX', '3');
  marker.setAttribute('refY', '3');
  marker.setAttribute('orient', 'auto');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M 0 0 L 6 3 L 0 6 z');
  path.setAttribute('fill', EDGE_COLOR[kind]);
  path.setAttribute('opacity', '0.7');
  marker.appendChild(path);
  return marker;
}
