import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, ForecastCardConfig, ForecastPoint } from "../types.js";
import { ASTRO_COLORS } from "../utils/theme.js";

class AstrosphericForecastCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: ForecastCardConfig;

  private _resizeObs?: ResizeObserver;

  setConfig(config: ForecastCardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 5;
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      type: "custom:astrospheric-forecast-card",
      cloud_cover_entity: "",
      seeing_entity: "",
      transparency_entity: "",
    };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObs?.disconnect();
  }

  private _findEntity(sensorType: string): string | undefined {
    if (!this.hass) return undefined;
    for (const [id, s] of Object.entries(this.hass.states)) {
      if ((s.attributes as Record<string, unknown>).astrospheric_sensor_type === sensorType) return id;
    }
    return undefined;
  }

  private _entity(cfgKey: string | undefined, sensorType: string): string | undefined {
    return (cfgKey && cfgKey.length > 0 ? cfgKey : undefined) ?? this._findEntity(sensorType);
  }

  private _getForecastData(entityId?: string): ForecastPoint[] {
    if (!entityId || !this.hass) return [];
    const entity = this.hass.states[entityId];
    if (!entity) return [];
    const raw = entity.attributes["forecast"];
    return Array.isArray(raw) ? raw as ForecastPoint[] : [];
  }

  protected firstUpdated(): void {
    const wrap = this.shadowRoot?.querySelector(".chart-wrap") as HTMLElement;
    if (!wrap) return;
    this._resizeObs = new ResizeObserver(() => this._drawChart());
    this._resizeObs.observe(wrap);
    this._drawChart();
  }

  protected updated(): void {
    this._drawChart();
  }

  private _drawChart(): void {
    const canvas = this.shadowRoot?.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas || !this._config) return;

    const wrap = canvas.parentElement!;
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    if (w === 0) return;
    const h = 200;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const cloudData = this._getForecastData(this._entity(this._config.cloud_cover_entity, "cloud_cover"));
    const seeingData = this._getForecastData(this._entity(this._config.seeing_entity, "seeing"));
    const transData = this._getForecastData(this._entity(this._config.transparency_entity, "transparency"));

    const primary = cloudData.length > 0 ? cloudData : seeingData.length > 0 ? seeingData : transData;
    if (primary.length === 0) {
      ctx.fillStyle = ASTRO_COLORS.textMuted;
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No forecast data available", w / 2, h / 2);
      return;
    }

    const pad = { top: 16, right: 12, bottom: 28, left: 38 };
    const pW = w - pad.left - pad.right;
    const pH = h - pad.top - pad.bottom;

    const times = primary.map(p => new Date(p.datetime).getTime());
    const tMin = times[0];
    const tMax = times[times.length - 1];
    const tRange = tMax - tMin || 1;

    const xOf = (t: number) => pad.left + ((t - tMin) / tRange) * pW;
    const yOf = (v: number, max: number) => pad.top + pH - (Math.max(0, Math.min(max, v)) / max) * pH;

    // Nighttime shading
    for (let i = 0; i < times.length - 1; i++) {
      const dt = new Date(times[i]);
      const hr = dt.getHours();
      if (hr >= 20 || hr < 6) {
        const x1 = xOf(times[i]);
        const x2 = xOf(times[i + 1]);
        ctx.fillStyle = "rgba(0, 200, 83, 0.02)";
        ctx.fillRect(x1, pad.top, x2 - x1, pH);
      }
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (pH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    // Cloud cover area + line
    if (cloudData.length > 1) {
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + pH);
      grad.addColorStop(0, "rgba(84, 110, 122, 0.35)");
      grad.addColorStop(1, "rgba(84, 110, 122, 0.03)");

      ctx.beginPath();
      ctx.moveTo(xOf(new Date(cloudData[0].datetime).getTime()), pad.top + pH);
      for (const p of cloudData) {
        ctx.lineTo(xOf(new Date(p.datetime).getTime()), yOf(p.value, 100));
      }
      ctx.lineTo(xOf(new Date(cloudData[cloudData.length - 1].datetime).getTime()), pad.top + pH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i < cloudData.length; i++) {
        const x = xOf(new Date(cloudData[i].datetime).getTime());
        const y = yOf(cloudData[i].value, 100);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#78909C";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Seeing area + line
    if (seeingData.length > 1) {
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + pH);
      grad.addColorStop(0, "rgba(0, 200, 83, 0.18)");
      grad.addColorStop(1, "rgba(0, 200, 83, 0.02)");

      ctx.beginPath();
      ctx.moveTo(xOf(new Date(seeingData[0].datetime).getTime()), pad.top + pH);
      for (const p of seeingData) {
        ctx.lineTo(xOf(new Date(p.datetime).getTime()), yOf((p.value / 5) * 100, 100));
      }
      ctx.lineTo(xOf(new Date(seeingData[seeingData.length - 1].datetime).getTime()), pad.top + pH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i < seeingData.length; i++) {
        const x = xOf(new Date(seeingData[i].datetime).getTime());
        const y = yOf((seeingData[i].value / 5) * 100, 100);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ASTRO_COLORS.excellent;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Transparency line (dashed, inverted)
    if (transData.length > 1) {
      ctx.beginPath();
      ctx.setLineDash([5, 3]);
      for (let i = 0; i < transData.length; i++) {
        const x = xOf(new Date(transData[i].datetime).getTime());
        const y = yOf(Math.max(0, 1 - transData[i].value / 27) * 100, 100);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ASTRO_COLORS.average;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Now indicator
    const now = Date.now();
    if (now >= tMin && now <= tMax) {
      const nx = xOf(now);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(nx, pad.top);
      ctx.lineTo(nx, pad.top + pH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Now", nx, pad.top - 4);
    }

    // Time labels
    ctx.fillStyle = ASTRO_COLORS.textMuted;
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    const minSpacingPx = 68;
    const labelIndices: number[] = [];
    let lastX = -Infinity;
    for (let i = 0; i < times.length; i++) {
      const x = xOf(times[i]);
      if (x - lastX >= minSpacingPx) {
        labelIndices.push(i);
        lastX = x;
      }
    }
    for (const i of labelIndices) {
      const dt = new Date(times[i]);
      const hr = dt.getHours();
      const ampm = hr < 12 ? "AM" : "PM";
      const hr12 = hr % 12 || 12;
      const lbl = dt.toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" }) + ` ${hr12}${ampm}`;
      ctx.fillText(lbl, xOf(times[i]), h - 6);
    }

    // Y-axis labels
    ctx.textAlign = "right";
    ctx.font = "9px sans-serif";
    for (let pct = 0; pct <= 100; pct += 25) {
      ctx.fillText(`${pct}`, pad.left - 6, yOf(pct, 100) + 3);
    }
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const cloudData = this._getForecastData(this._entity(this._config.cloud_cover_entity, "cloud_cover"));
    const hours = cloudData.length || "\u2014";

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title || "Forecast"}</span>
          <span class="subtitle">${hours}-hour outlook</span>
        </div>
        <div class="chart-wrap">
          <canvas></canvas>
        </div>
        <div class="legend">
          <div class="legend-item">
            <span class="legend-swatch" style="background: #78909C"></span>
            <span>Clouds</span>
          </div>
          <div class="legend-item">
            <span class="legend-swatch" style="background: ${ASTRO_COLORS.excellent}"></span>
            <span>Seeing</span>
          </div>
          <div class="legend-item">
            <span class="legend-swatch dashed" style="border-color: ${ASTRO_COLORS.average}"></span>
            <span>Transparency</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host { display: block; }
    ha-card {
      background: linear-gradient(145deg, rgba(26, 32, 64, 0.92) 0%, rgba(11, 16, 38, 0.97) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
      color: ${unsafeCSS(ASTRO_COLORS.textPrimary)};
      padding: 20px;
      border-radius: var(--ha-card-border-radius, 16px);
      overflow: hidden;
    }
    .header {
      display: flex; justify-content: space-between; align-items: baseline;
      padding-bottom: 12px;
    }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .subtitle { font-size: 0.8em; color: ${unsafeCSS(ASTRO_COLORS.textSecondary)}; }
    .chart-wrap { width: 100%; }
    canvas { width: 100%; display: block; border-radius: 8px; }
    .legend {
      display: flex; justify-content: center; gap: 16px;
      padding-top: 12px; margin-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .legend-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.75em; color: ${unsafeCSS(ASTRO_COLORS.textSecondary)};
    }
    .legend-swatch {
      width: 14px; height: 3px; border-radius: 2px;
    }
    .legend-swatch.dashed {
      background: none; height: 0;
      border-top: 2px dashed;
      width: 14px;
    }
  `;
}

customElements.define("astrospheric-forecast-card", AstrosphericForecastCard);
