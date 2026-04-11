import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, TonightCardConfig } from "../types.js";
import { ASTRO_COLORS, seeingColor, transparencyColor, cloudCoverColor } from "../utils/theme.js";

type Verdict = "GO" | "MARGINAL" | "NO-GO";

interface VerdictInfo {
  label: string;
  color: string;
  icon: string;
}

const VERDICTS: Record<Verdict, VerdictInfo> = {
  GO: { label: "GO", color: ASTRO_COLORS.excellent, icon: "mdi:check-circle" },
  MARGINAL: { label: "MARGINAL", color: ASTRO_COLORS.average, icon: "mdi:alert-circle" },
  "NO-GO": { label: "NO-GO", color: ASTRO_COLORS.poor, icon: "mdi:close-circle" },
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
    return 4;
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

  private _findEntity(sensorType: string): string | undefined {
    for (const [id, s] of Object.entries(this.hass.states)) {
      if ((s.attributes as Record<string, unknown>).astrospheric_sensor_type === sensorType) return id;
    }
    return undefined;
  }

  private _entity(cfgKey: string | undefined, sensorType: string): string | undefined {
    return (cfgKey && cfgKey.length > 0 ? cfgKey : undefined) ?? this._findEntity(sensorType);
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
    const seeing = Number(this._getState(this._entity(this._config.seeing_entity, "seeing"))) || 0;
    const transparency = Number(this._getState(this._entity(this._config.transparency_entity, "transparency"))) || 0;
    const clouds = Number(this._getState(this._entity(this._config.cloud_cover_entity, "cloud_cover"))) || 0;

    const seeingGoThresh = this._config.seeing_go_threshold ?? 4;
    const transGoThresh = this._config.transparency_go_threshold ?? 9;
    const cloudGoThresh = this._config.cloud_go_threshold ?? 20;
    const seeingNogoThresh = this._config.seeing_nogo_threshold ?? 2;
    const cloudNogoThresh = this._config.cloud_nogo_threshold ?? 70;

    if (seeing <= seeingNogoThresh || clouds >= cloudNogoThresh) return "NO-GO";
    if (seeing >= seeingGoThresh && transparency <= transGoThresh && clouds <= cloudGoThresh) return "GO";
    return "MARGINAL";
  }

  private _findBestHour(): string | null {
    const raw = this._getAttr(this._entity(this._config.seeing_entity, "seeing"), "forecast");
    const forecast = Array.isArray(raw) ? raw as Array<{ datetime: string; value: number }> : [];
    if (forecast.length === 0) return null;

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

  private _renderConditionBar(label: string, pct: number, color: string, valueText: string) {
    const clampedPct = Math.max(2, Math.min(100, pct));
    return html`
      <div class="cond-bar">
        <span class="cond-label">${label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${clampedPct}%; background: linear-gradient(90deg, ${color}99, ${color})"></div>
        </div>
        <span class="cond-value" style="color: ${color}">${valueText}</span>
      </div>
    `;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const verdict = this._computeVerdict();
    const info = VERDICTS[verdict];
    const seeing = Number(this._getState(this._entity(this._config.seeing_entity, "seeing"))) || 0;
    const transparency = Number(this._getState(this._entity(this._config.transparency_entity, "transparency"))) || 0;
    const clouds = Number(this._getState(this._entity(this._config.cloud_cover_entity, "cloud_cover"))) || 0;
    const bestHour = this._findBestHour();

    const seeingPct = (seeing / 5) * 100;
    const transPct = Math.max(0, (1 - transparency / 27)) * 100;
    const cloudPct = Math.max(0, (1 - clouds / 100)) * 100;

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title || "Tonight's Outlook"}</span>
        </div>
        <div class="content">
          <div class="verdict-area">
            <div class="verdict-ring"
              style="border-color: ${info.color}; box-shadow: 0 0 24px ${info.color}40, inset 0 0 24px ${info.color}15; background: ${info.color}0A">
              <ha-icon icon="${info.icon}" style="--mdc-icon-size: 30px; color: ${info.color}"></ha-icon>
              <span class="verdict-label" style="color: ${info.color}">${info.label}</span>
            </div>
          </div>
          <div class="conditions">
            ${this._renderConditionBar("Seeing", seeingPct, seeingColor(seeing), SEEING_LABELS[Math.round(seeing)] || `${seeing}`)}
            ${this._renderConditionBar("Transparency", transPct, transparencyColor(transparency), `${transparency}`)}
            ${this._renderConditionBar("Clouds", cloudPct, cloudCoverColor(clouds), `${clouds}%`)}
          </div>
          ${bestHour ? html`
            <div class="best-window">
              <ha-icon icon="mdi:star-four-points" style="--mdc-icon-size: 16px; color: ${ASTRO_COLORS.sun}"></ha-icon>
              <span>Best window: <strong>${bestHour}</strong></span>
            </div>
          ` : nothing}
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
    .header { padding-bottom: 16px; }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .content {
      display: flex; flex-direction: column; align-items: center; gap: 20px;
    }
    .verdict-area { padding: 8px 0; }
    .verdict-ring {
      width: 120px; height: 120px; border-radius: 50%;
      border: 3px solid;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 4px;
      animation: breathe 3s ease-in-out infinite;
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }
    .verdict-label {
      font-size: 1.3em; font-weight: 800; letter-spacing: 2px;
    }
    .conditions {
      width: 100%; display: flex; flex-direction: column; gap: 10px;
    }
    .cond-bar {
      display: grid; grid-template-columns: 100px 1fr 75px;
      align-items: center; gap: 10px;
    }
    .cond-label {
      font-size: 0.78em; text-transform: uppercase; letter-spacing: 0.5px;
      color: ${unsafeCSS(ASTRO_COLORS.textSecondary)};
    }
    .bar-track {
      height: 6px; background: rgba(255, 255, 255, 0.06);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill {
      height: 100%; border-radius: 3px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .cond-value {
      font-size: 0.8em; font-weight: 600; text-align: right;
    }
    .best-window {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.85em; color: ${unsafeCSS(ASTRO_COLORS.textSecondary)};
      padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06);
      width: 100%; justify-content: center;
    }
    .best-window strong { color: ${unsafeCSS(ASTRO_COLORS.sun)}; }
  `;
}

customElements.define("astrospheric-tonight-card", AstrosphericTonightCard);
