/**
 * Astrospheric dark sky theme constants and helpers.
 */

export const ASTRO_COLORS = {
  // Backgrounds
  bgDeep: "#0B1026",
  bgMidnight: "#151B3B",
  bgCard: "#1A2040",
  bgSurface: "#222850",

  // Text
  textPrimary: "#E8E6E3",
  textSecondary: "#8B8FA3",
  textMuted: "#5C6078",

  // Condition scale
  excellent: "#00C853",
  aboveAvg: "#64DD17",
  average: "#FFD600",
  belowAvg: "#FF9100",
  poor: "#FF1744",
  cloudy: "#546E7A",

  // Celestial
  moon: "#FFF8E1",
  sun: "#FFD54F",
  sunGlow: "rgba(255, 213, 79, 0.3)",

  // Planets
  mercury: "#B0BEC5",
  venus: "#FFF59D",
  mars: "#E57373",
  jupiter: "#FFB74D",
  saturn: "#FFE082",
  uranus: "#80DEEA",
  neptune: "#64B5F6",
} as const;

export const PLANET_COLORS: Record<string, string> = {
  Mercury: ASTRO_COLORS.mercury,
  Venus: ASTRO_COLORS.venus,
  Mars: ASTRO_COLORS.mars,
  Jupiter: ASTRO_COLORS.jupiter,
  Saturn: ASTRO_COLORS.saturn,
  Uranus: ASTRO_COLORS.uranus,
  Neptune: ASTRO_COLORS.neptune,
};

/**
 * Get condition color for a 0-1 normalized value (0=poor, 1=excellent).
 */
export function conditionColor(normalized: number): string {
  if (normalized >= 0.8) return ASTRO_COLORS.excellent;
  if (normalized >= 0.6) return ASTRO_COLORS.aboveAvg;
  if (normalized >= 0.4) return ASTRO_COLORS.average;
  if (normalized >= 0.2) return ASTRO_COLORS.belowAvg;
  return ASTRO_COLORS.poor;
}

/**
 * Seeing value (0-5) to color.
 */
export function seeingColor(value: number): string {
  return conditionColor(value / 5);
}

/**
 * Transparency value (0-27+) to color (inverted — lower is better).
 */
export function transparencyColor(value: number): string {
  const normalized = Math.max(0, 1 - value / 27);
  return conditionColor(normalized);
}

/**
 * Cloud cover (0-100%) to color (inverted — lower is better).
 */
export function cloudCoverColor(value: number): string {
  const normalized = Math.max(0, 1 - value / 100);
  return conditionColor(normalized);
}
