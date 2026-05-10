/**
 * Minimap of the current section's CFG. Pure canvas render — no DOM measurement.
 * Re-renders on section change, but only when the right panel is visible.
 */

import { el, mount } from '../lib/dom';
import type { Section } from '../types';
import { CONFIG, blockHeight } from '../config';

const W = 180;
const H = 400;

export function renderMinimap(host: HTMLElement, section: Section): void {
  const header = el('header', { class: 'panel-header' }, [
    el('span', { class: 'panel-title', text: 'Overview' }),
  ]);

  const canvas = el('canvas', {
    attrs: { width: String(W), height: String(H), 'aria-hidden': 'true' },
  }) as HTMLCanvasElement;

  const wrap = el('div', { class: 'minimap' }, [canvas]);

  mount(host, el('div', { attrs: { style: 'display:contents' } }, [header, wrap]));

  drawMinimap(canvas, section);
}

function drawMinimap(canvas: HTMLCanvasElement, section: Section): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, W, H);

  const allX = section.graph.map(b => b.x);
  const allY = section.graph.map(b => b.y);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX) + CONFIG.block.width;
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY) + 180; // approximate block height for scaling
  const scaleX = (W - 20) / Math.max(1, maxX - minX);
  const scaleY = (H - 40) / Math.max(1, maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  for (const b of section.graph) {
    const rx = 10 + (b.x - minX) * scale;
    const ry = 20 + (b.y - minY) * scale;
    const rw = CONFIG.block.width * scale;
    const rh = blockHeight(b.lines.length) * scale;
    ctx.fillStyle = b.badge === 'entry' ? '#1e3a1e'
                  : b.badge === 'exit'  ? '#3a1e1e'
                  : '#1e2a36';
    ctx.strokeStyle = b.badge === 'entry' ? '#5a8a3a'
                    : b.badge === 'exit'  ? '#c0392b'
                    : '#4a6070';
    ctx.lineWidth = 0.5;

    // roundRect is widely supported; fall back to fillRect if not.
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, Math.max(rh, 4), 1);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(rx, ry, rw, Math.max(rh, 4));
      ctx.strokeRect(rx, ry, rw, Math.max(rh, 4));
    }

    // line indicators
    ctx.fillStyle = '#4a6070';
    for (let i = 0; i < b.lines.length; i++) {
      const ly = ry + 6 + i * 16 * scale;
      ctx.fillRect(rx + 3, ly, rw * 0.7, Math.max(1, 2 * scale));
    }
  }
}
