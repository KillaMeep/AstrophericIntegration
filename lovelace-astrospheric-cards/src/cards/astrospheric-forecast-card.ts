import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, ForecastCardConfig, ForecastPoint } from "../types.js";
import { ASTRO_COLORS } from "../utils/theme.js";

// uPlot imported at runtime; declare minimal types
declare class uPlot {
  constructor(opts: unknown, data: unknown[][], target: HTMLElement);
  destroy(): void;
  setData(data: unknown[][]): void;
  setSize(size: { width: number; height: number }): void;
}

class AstrosphericForecastCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: ForecastCardConfig;

  private _chart?: uPlot;
  private _resizeObserver?: ResizeObserver;

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
    this._chart?.destroy();
    this._chart = undefined;
    this._resizeObserver?.disconnect();
  }

  private _getForecastData(entityId?: string): ForecastPoint[] {
    if (!entityId || !this.hass) return [];
    const entity = this.hass.states[entityId];
    if (!entity) return [];
    const raw = entity.attributes["forecast"];
    return Array.isArray(raw) ? raw as ForecastPoint[] : [];
  }

  protected firstUpdated(): void {
    this._initChart();
  }

  protected updated(): void {
    this._updateChart();
  }

  private _initChart(): void {
    const container = this.shadowRoot?.querySelector(".chart-container") as HTMLElement;
    if (!container) return;

    // If uPlot is not loaded, fall back to a simple table display
    if (typeof (window as any).uPlot === "undefined") {
      this._renderFallback(container);
      return;
    }

    const cloudForecast = this._getForecastData(this._config.cloud_cover_entity);
    if (cloudForecast.length === 0) return;

    const timestamps = cloudForecast.map((p) => new Date(p.datetime).getTime() / 1000);
    const cloudData = cloudForecast.map((p) => p.value);
    const seeingForecast = this._getForecastData(this._config.seeing_entity);
    const seeingData = seeingForecast.map((p) => p.value);
    const transForecast = this._getForecastData(this._config.transparency_entity);
    const transData = transForecast.map((p) => p.value);

    const width = container.clientWidth || 400;
    const height = 250;

    const nowSec = Date.now() / 1000;

    const opts = {
      width,
      height,
      cursor: { show: true },
      scales: {
        x: { time: true },
        y: { auto: true },
        y2: { auto: true, side: 1 },
      },
      axes: [
        { stroke: ASTRO_COLORS.textSecondary, grid: { stroke: "rgba(255,255,255,0.05)" } },
        { stroke: ASTRO_COLORS.textSecondary, grid: { stroke: "rgba(255,255,255,0.05)" }, label: "Cloud %" },
        { stroke: ASTRO_COLORS.textSecondary, side: 1, grid: { show: false }, label: "Seeing" },
      ],
      series: [
        {},
        {
          label: "Cloud Cover",
          stroke: "#546E7A",
          fill: "rgba(84, 110, 122, 0.15)",
          width: 2,
          scale: "y",
        },
        {
          label: "Seeing",
          stroke: ASTRO_COLORS.excellent,
          width: 2,
          scale: "y2",
        },
        {
          label: "Transparency",
          stroke: ASTRO_COLORS.average,
          width: 2,
          dash: [5, 3],
          scale: "y",
        },
      ],
      plugins: [
        // Now-line plugin
        {
          hooks: {
            draw: [
              (u: any) => {
                const ctx = u.ctx as CanvasRenderingContext2D;
                const left = u.valToPos(nowSec, "x", true);
                if (left > u.bbox.left && left < u.bbox.left + u.bbox.width) {
                  ctx.save();
                  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                  ctx.lineWidth = 1;
                  ctx.setLineDash([4, 4]);
                  ctx.beginPath();
                  ctx.moveTo(left, u.bbox.top);
                  ctx.lineTo(left, u.bbox.top + u.bbox.height);
                  ctx.stroke();
                  ctx.restore();
                }
              },
            ],
          },
        },
      ],
    };

    const data = [timestamps, cloudData, seeingData, transData];

    this._chart = new (window as any).uPlot(opts, data, container);

    // Handle resize
    this._resizeObserver = new ResizeObserver(() => {
      if (this._chart && container.clientWidth > 0) {
        this._chart.setSize({ width: container.clientWidth, height });
      }
    });
    this._resizeObserver.observe(container);
  }

  private _updateChart(): void {
    if (!this._chart || !this._config) return;

    const cloudForecast = this._getForecastData(this._config.cloud_cover_entity);
    if (cloudForecast.length === 0) return;

    const timestamps = cloudForecast.map((p) => new Date(p.datetime).getTime() / 1000);
    const cloudData = cloudForecast.map((p) => p.value);
    const seeingData = this._getForecastData(this._config.seeing_entity).map((p) => p.value);
    const transData = this._getForecastData(this._config.transparency_entity).map((p) => p.value);

    this._chart.setData([timestamps, cloudData, seeingData, transData]);
  }

  private _renderFallback(container: HTMLElement): void {
    // Simple text-based fallback if uPlot not loaded
    const cloudForecast = this._getForecastData(this._config.cloud_cover_entity);
    if (cloudForecast.length === 0) {
      container.innerHTML = '<div style="padding: 20px; text-align: center; color: #8B8FA3;">No forecast data available</div>';
      return;
    }

    // Render as simple bar visualization using CSS
    let barHtml = '<div style="display: flex; gap: 1px; height: 80px; align-items: flex-end;">';
    for (const point of cloudForecast) {
      const h = Math.max(2, (point.value / 100) * 80);
      const color = point.value < 30 ? ASTRO_COLORS.excellent : point.value < 60 ? ASTRO_COLORS.average : ASTRO_COLORS.poor;
      barHtml += `<div style="flex: 1; height: ${h}px; background: ${color}; border-radius: 1px 1px 0 0;" title="${point.datetime}: ${point.value}%"></div>`;
    }
    barHtml += "</div>";
    barHtml += '<div style="display: flex; justify-content: space-between; font-size: 10px; color: #8B8FA3; margin-top: 4px;">';
    barHtml += `<span>Now</span><span>+${cloudForecast.length}h</span>`;
    barHtml += "</div>";
    container.innerHTML = barHtml;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    return html`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title || "Forecast"}</span>
          <span class="subtitle">81-hour outlook</span>
        </div>
        <div class="card-content">
          <div class="chart-container"></div>
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
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 12px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .subtitle {
      font-size: 0.8em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .chart-container {
      width: 100%;
      min-height: 80px;
    }
    /* uPlot theme overrides */
    .chart-container :global(.u-wrap) {
      background: transparent !important;
    }
  `;
}

customElements.define("astrospheric-forecast-card", AstrosphericForecastCard);
