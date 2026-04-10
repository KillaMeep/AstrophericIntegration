import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, TonightCardConfig } from "../types.js";
import { ASTRO_COLORS } from "../utils/theme.js";

type Verdict = "GO" | "MARGINAL" | "NO-GO";

interface VerdictInfo {
  label: string;
  color: string;
  bg: string;
  icon: string;
}

const VERDICTS: Record<Verdict, VerdictInfo> = {
  GO: {
    label: "GO",
    color: ASTRO_COLORS.excellent,
    bg: "rgba(0, 200, 83, 0.12)",
    icon: "mdi:check-circle",
  },
  MARGINAL: {
    label: "MARGINAL",
    color: ASTRO_COLORS.average,
    bg: "rgba(255, 214, 0, 0.12)",
    icon: "mdi:alert-circle",
  },
  "NO-GO": {
    label: "NO-GO",
    color: ASTRO_COLORS.poor,
    bg: "rgba(255, 23, 68, 0.12)",
    icon: "mdi:close-circle",
  },
};

const SEEING_LABELS: Record<number, string> = {
  0: "Cloudy", 1: "Poor", 2: "Below Avg", 3: "Average", 4: "Above Avg", 5: "Excellent",
};

class AstrosphericTonightCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: TonightCardConfig;

  setConfig(config: TonightCardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 3;
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      type: "custom:astrospheric-tonight-card",
      seeing_entity: "",
      transparency_entity: "",
      cloud_cover_entity: "",
      seeing_go_threshold: 4,
      transparency_go_threshold: 9,
      cloud_go_threshold: 20,
      seeing_nogo_threshold: 2,
      cloud_nogo_threshold: 70,
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

  private _computeVerdict(): Verdict {
    const seeing = Number(this._getState(this._config.seeing_entity)) || 0;
    const transparency = Number(this._getState(this._config.transparency_entity)) || 0;
    const clouds = Number(this._getState(this._config.cloud_cover_entity)) || 0;

    const seeingGoThresh = this._config.seeing_go_threshold ?? 4;
    const transGoThresh = this._config.transparency_go_threshold ?? 9;
    const cloudGoThresh = this._config.cloud_go_threshold ?? 20;
    const seeingNogoThresh = this._config.seeing_nogo_threshold ?? 2;
    const cloudNogoThresh = this._config.cloud_nogo_threshold ?? 70;

    // NO-GO check first
    if (seeing <= seeingNogoThresh || clouds >= cloudNogoThresh) {
      return "NO-GO";
    }

    // GO check
    if (seeing >= seeingGoThresh && transparency <= transGoThresh && clouds <= cloudGoThresh) {
      return "GO";
    }

    return "MARGINAL";
  }

  private _findBestHour(): string | null {
    const forecast = (this._getAttr(this._config.seeing_entity, "forecast") || []) as Array<{ datetime: string; value: number }>;
    if (forecast.length === 0) return null;

    // Find the best seeing hour that's in the future and after sunset (rough: after 20:00 local or before 06:00)
    let bestVal = -1;
    let bestTime = "";

    for (const point of forecast) {
      const dt = new Date(point.datetime);
      const hour = dt.getHours();
      const isNight = hour >= 20 || hour < 6;
      if (isNight && point.value > bestVal && dt.getTime() > Date.now()) {
        bestVal = point.value;
        bestTime = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    }

    return bestVal > 0 ? `${bestTime} (${SEEING_LABELS[bestVal] || bestVal})` : null;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const verdict = this._computeVerdict();
    const info = VERDICTS[verdict];
    const seeing = Number(this._getState(this._config.seeing_entity)) || 0;
    const transparency = Number(this._getState(this._config.transparency_entity)) || 0;
    const clouds = Number(this._getState(this._config.cloud_cover_entity)) || 0;
    const bestHour = this._findBestHour();

    return html`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title || "Tonight"}</span>
        </div>
        <div class="card-content">
          <div class="verdict-badge" style="background: ${info.bg}; color: ${info.color}; border: 2px solid ${info.color}">
            <ha-icon icon="${info.icon}" style="--mdc-icon-size: 28px; color: ${info.color}"></ha-icon>
            <span class="verdict-text">${info.label}</span>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Seeing</span>
              <span class="stat-value">${SEEING_LABELS[Math.round(seeing)] || seeing}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Transparency</span>
              <span class="stat-value">${transparency}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Clouds</span>
              <span class="stat-value">${clouds}%</span>
            </div>
          </div>
          ${bestHour ? html`
            <div class="best-hour">
              <ha-icon icon="mdi:star" style="--mdc-icon-size: 16px; color: ${ASTRO_COLORS.sun}"></ha-icon>
              <span>Best window: ${bestHour}</span>
            </div>
          ` : nothing}
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
      padding-bottom: 12px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .verdict-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 28px;
      border-radius: 12px;
      font-weight: 700;
    }
    .verdict-text {
      font-size: 1.6em;
      letter-spacing: 2px;
    }
    .stats {
      display: flex;
      gap: 24px;
      width: 100%;
      justify-content: center;
    }
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .stat-label {
      font-size: 0.75em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .stat-value {
      font-size: 1em;
      font-weight: 600;
    }
    .best-hour {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85em;
      color: var(--secondary-text-color, #8B8FA3);
      padding-top: 8px;
      border-top: 1px solid var(--divider-color, rgba(255,255,255,0.06));
      width: 100%;
      justify-content: center;
    }
  `;
}

customElements.define("astrospheric-tonight-card", AstrosphericTonightCard);
