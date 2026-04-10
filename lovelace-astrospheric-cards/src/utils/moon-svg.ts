/**
 * Generate an SVG moon phase visualization.
 *
 * Uses a simple shadow approach: draw a circle (moon), then overlay a
 * shape representing the shadow based on illumination and phase.
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

  // Moon base circle (dark side)
  const moonDark = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2A2D35"/>`;

  // Lit portion
  const illFraction = illumination / 100;

  if (illFraction < 0.01) {
    // New moon — all dark
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      ${moonDark}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ASTRO_COLORS.textMuted}" stroke-width="0.5"/>
    </svg>`;
  }

  if (illFraction > 0.99) {
    // Full moon — all lit
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ASTRO_COLORS.moon}"/>
    </svg>`;
  }

  // For partial phases, use two arcs to create the terminator.
  // The lit area is drawn as a path using two semicircles:
  // one following the moon edge, one for the terminator.
  const isWaxing = phase < 0.5;
  const terminatorBulge = Math.cos(phase * 2 * Math.PI) * r;

  // Draw the lit portion
  const sweepOuter = isWaxing ? 1 : 0;
  const litPath = `
    M ${cx} ${cy - r}
    A ${r} ${r} 0 0 ${sweepOuter} ${cx} ${cy + r}
    A ${Math.abs(terminatorBulge)} ${r} 0 0 ${terminatorBulge > 0 ? 1 : 0} ${cx} ${cy - r}
    Z
  `;

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${moonDark}
    <path d="${litPath}" fill="${ASTRO_COLORS.moon}"/>
  </svg>`;
}
