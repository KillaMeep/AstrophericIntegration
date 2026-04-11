/**
 * Generate an SVG moon phase visualization with gradient lighting
 * and subtle earthshine effect.
 */

import { ASTRO_COLORS } from "./theme.js";

/**
 * Generate SVG markup for a moon phase.
 *
 * @param phase Phase value 0-1 (0=new, 0.5=full)
 * @param illumination Illumination 0-100%
 * @param size Diameter in pixels
 * @returns SVG markup string
 */
export function moonPhaseSVG(
  phase: number,
  illumination: number,
  size: number
): string {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  const defs = `
    <defs>
      <radialGradient id="ml-lit" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#FFFDE7"/>
        <stop offset="100%" stop-color="${ASTRO_COLORS.moon}"/>
      </radialGradient>
      <radialGradient id="ml-dark" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3A3D45"/>
        <stop offset="100%" stop-color="#2A2D35"/>
      </radialGradient>
      <filter id="ml-glow">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

  const darkCircle = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ml-dark)"/>`;
  const earthshine = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(160,180,220,0.04)"/>`;
  const illFraction = illumination / 100;

  if (illFraction < 0.01) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      ${defs}${darkCircle}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(160,180,220,0.12)" stroke-width="0.5"/>
    </svg>`;
  }

  if (illFraction > 0.99) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      ${defs}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ml-lit)" filter="url(#ml-glow)"/>
    </svg>`;
  }

  const isWaxing = phase < 0.5;
  const terminatorBulge = Math.cos(phase * 2 * Math.PI) * r;
  const sweepOuter = isWaxing ? 1 : 0;
  const litPath = `
    M ${cx} ${cy - r}
    A ${r} ${r} 0 0 ${sweepOuter} ${cx} ${cy + r}
    A ${Math.abs(terminatorBulge)} ${r} 0 0 ${terminatorBulge > 0 ? 1 : 0} ${cx} ${cy - r}
    Z
  `;

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${defs}${darkCircle}${earthshine}
    <path d="${litPath}" fill="url(#ml-lit)" filter="url(#ml-glow)"/>
  </svg>`;
}
