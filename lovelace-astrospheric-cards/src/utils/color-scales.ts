/**
 * Color scale utilities for gradient rendering.
 */

export interface ColorStop {
  position: number; // 0-1
  color: string;
}

const CONDITION_GRADIENT: ColorStop[] = [
  { position: 0.0, color: "#FF1744" },
  { position: 0.2, color: "#FF9100" },
  { position: 0.4, color: "#FFD600" },
  { position: 0.6, color: "#64DD17" },
  { position: 0.8, color: "#00C853" },
  { position: 1.0, color: "#00C853" },
];

/**
 * Create a CSS linear-gradient string for a condition gauge.
 */
export function conditionGradientCSS(direction = "to right"): string {
  const stops = CONDITION_GRADIENT.map(
    (s) => `${s.color} ${s.position * 100}%`
  ).join(", ");
  return `linear-gradient(${direction}, ${stops})`;
}

/**
 * Interpolate between two hex colors.
 */
export function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bv.toString(16).padStart(2, "0")}`;
}

/**
 * Sample color from the condition gradient at a normalized position (0-1).
 */
export function sampleConditionColor(normalized: number): string {
  const clamped = Math.max(0, Math.min(1, normalized));
  for (let i = 0; i < CONDITION_GRADIENT.length - 1; i++) {
    const curr = CONDITION_GRADIENT[i];
    const next = CONDITION_GRADIENT[i + 1];
    if (clamped >= curr.position && clamped <= next.position) {
      const t = (clamped - curr.position) / (next.position - curr.position);
      return lerpColor(curr.color, next.color, t);
    }
  }
  return CONDITION_GRADIENT[CONDITION_GRADIENT.length - 1].color;
}
