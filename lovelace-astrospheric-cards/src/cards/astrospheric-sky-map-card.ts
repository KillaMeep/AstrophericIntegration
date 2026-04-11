import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, SkyMapCardConfig, PlanetInfo } from "../types.js";
import { ASTRO_COLORS, PLANET_COLORS } from "../utils/theme.js";
import { altAzToXY, magnitudeToRadius } from "../utils/astronomy-math.js";

class AstrosphericSkyMapCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: SkyMapCardConfig;

  private _canvas?: HTMLCanvasElement;

  setConfig(config: SkyMapCardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 6;
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      type: "custom:astrospheric-sky-map-card",
      sun_altitude_entity: "",
      sun_azimuth_entity: "",
      moon_altitude_entity: "",
      moon_azimuth_entity: "",
      visible_planets_entity: "",
    };
  }

  private _getState(entityId?: string): string | undefined {
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId]?.state;
  }

  private _getAttr(entityId: string | undefined, attr: string): unknown {
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId]?.attributes[attr];
  }

  protected firstUpdated(): void {
    this._canvas = this.shadowRoot?.querySelector("canvas") as HTMLCanvasElement;
    this._drawSkyMap();
  }

  protected updated(): void {
    this._drawSkyMap();
  }

  private _drawSkyMap(): void {
    if (!this._canvas || !this.hass || !this._config) return;

    const canvas = this._canvas;
    const size = canvas.width;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 30;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = ASTRO_COLORS.bgDeep;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
    ctx.fill();

    // Altitude rings (30°, 60°)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (const alt of [30, 60]) {
      const r = ((90 - alt) / 90) * radius;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Horizon circle
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Cardinal labels
    ctx.fillStyle = ASTRO_COLORS.textSecondary;
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const cardinals = [
      { label: "N", angle: -Math.PI / 2 },
      { label: "E", angle: 0 },
      { label: "S", angle: Math.PI / 2 },
      { label: "W", angle: Math.PI },
    ];
    for (const c of cardinals) {
      const lx = cx + (radius + 15) * Math.cos(c.angle);
      const ly = cy + (radius + 15) * Math.sin(c.angle);
      ctx.fillText(c.label, lx, ly);
    }

    // Cross-hairs
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    // Draw Sun
    const sunAlt = Number(this._getState(this._config.sun_altitude_entity)) || 0;
    const sunAz = Number(this._getState(this._config.sun_azimuth_entity)) || 0;
    if (sunAlt > 0) {
      const [sx, sy] = altAzToXY(sunAlt, sunAz, radius);
      // Glow
      const glow = ctx.createRadialGradient(cx + sx, cy + sy, 0, cx + sx, cy + sy, 12);
      glow.addColorStop(0, ASTRO_COLORS.sunGlow);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx + sx, cy + sy, 12, 0, Math.PI * 2);
      ctx.fill();
      // Dot
      ctx.fillStyle = ASTRO_COLORS.sun;
      ctx.beginPath();
      ctx.arc(cx + sx, cy + sy, 5, 0, Math.PI * 2);
      ctx.fill();
      // Label
      ctx.fillStyle = ASTRO_COLORS.sun;
      ctx.font = "10px sans-serif";
      ctx.fillText("Sun", cx + sx, cy + sy - 10);
    }

    // Draw Moon
    const moonAlt = Number(this._getState(this._config.moon_altitude_entity)) || 0;
    const moonAz = Number(this._getState(this._config.moon_azimuth_entity)) || 0;
    if (moonAlt > 0) {
      const [mx, my] = altAzToXY(moonAlt, moonAz, radius);
      ctx.fillStyle = ASTRO_COLORS.moon;
      ctx.beginPath();
      ctx.arc(cx + mx, cy + my, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "10px sans-serif";
      ctx.fillText("Moon", cx + mx, cy + my - 10);
    }

    // Draw Planets
    const rawPlanets = this._getAttr(this._config.visible_planets_entity, "planets");
    const planets = Array.isArray(rawPlanets) ? rawPlanets as PlanetInfo[] : [];
    for (const planet of planets) {
      if (!planet || planet.altitude <= 0) continue;
      const [px, py] = altAzToXY(planet.altitude, planet.azimuth, radius);
      const color = PLANET_COLORS[planet.name] || ASTRO_COLORS.textPrimary;
      const r = magnitudeToRadius(planet.magnitude);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx + px, cy + py, Math.max(r, 2.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "9px sans-serif";
      ctx.fillStyle = color;
      ctx.fillText(planet.name, cx + px, cy + py - 8);
    }

    // Zenith marker
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    return html`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title || "Sky Map"}</span>
        </div>
        <div class="card-content">
          <canvas width="300" height="300"></canvas>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, #1A2040);
      color: var(--primary-text-color, #E8E6E3);
      padding: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .card-header {
      padding-bottom: 8px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .card-content {
      display: flex;
      justify-content: center;
    }
    canvas {
      max-width: 100%;
      height: auto;
    }
  `;
}

customElements.define("astrospheric-sky-map-card", AstrosphericSkyMapCard);
