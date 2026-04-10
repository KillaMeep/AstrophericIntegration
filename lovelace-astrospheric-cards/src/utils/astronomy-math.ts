/**
 * Astronomy math utilities for sky map rendering.
 */

/**
 * Convert altitude/azimuth to x,y on a polar projection.
 * Center = zenith (alt 90°), edge = horizon (alt 0°).
 *
 * @param altitude Degrees above horizon (-90 to 90)
 * @param azimuth Degrees from north (0-360, clockwise)
 * @param radius Radius of the projection circle in pixels
 * @returns [x, y] relative to center of circle
 */
export function altAzToXY(
  altitude: number,
  azimuth: number,
  radius: number
): [number, number] {
  // r = 0 at zenith (90°), r = radius at horizon (0°)
  const r = ((90 - Math.max(0, altitude)) / 90) * radius;
  // Azimuth: 0=North(up), 90=East(right), convert to math angle
  const angle = ((azimuth - 90) * Math.PI) / 180;
  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);
  return [x, y];
}

/**
 * Convert star magnitude to a display radius in pixels.
 * Brighter stars (lower magnitude) get larger dots.
 */
export function magnitudeToRadius(mag: number): number {
  // Magnitude range: ~-1 (Sirius) to 5 (naked eye limit)
  // Map to radius: 4px (brightest) to 0.5px (dimmest)
  const clamped = Math.max(-1.5, Math.min(5.5, mag));
  return Math.max(0.5, 4 - (clamped + 1.5) * 0.5);
}

/**
 * Degrees to cardinal direction string.
 */
export function degreesToCardinal(degrees: number): string {
  const dirs = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
  return dirs[index];
}
