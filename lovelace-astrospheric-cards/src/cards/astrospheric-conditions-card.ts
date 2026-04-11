import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, ConditionsCardConfig } from "../types.js";
import { ASTRO_COLORS, seeingColor, transparencyColor, cloudCoverColor } from "../utils/theme.js";

const SEEING_LABELS: Record<number, string> = {
  0: "Cloudy", 1: "Poor", 2: "Below Avg", 3: "Average", 4: "Above Avg", 5: "Excellent",
};

const TRANSPARENCY_LABELS: [number, string][] = [
  [5, "Excellent"], [9, "Above Avg"], [13, "Average"], [23, "Below Avg"], [27, "Poor"],
];

function transparencyLabel(val: number): string {
  for (const [thresh, label] of TRANSPARENCY_LABELS) {
    if (val <= thresh) return label;
  }
  return "Cloudy";
}

const GAUGE_R = 40;
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R;

class AstrosphericConditionsCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: ConditionsCardConfig;

  setConfig(config: ConditionsCardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 4;
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      type: "custom:astrospheric-conditions-card",
      cloud_cover_entity: "",
      seeing_entity: "",
      transparency_entity: "",
      temperature_entity: "",
      dew_point_entity: "",
      wind_speed_entity: "",
      wind_direction_entity: "",
    };
  }

  static getConfigElement() {
    return document.createElement("astrospheric-conditions-editor");
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

  private _renderRingGauge(label: string, pct: number, textLabel: string, color: string) {
    const clamped = Math.max(0, Math.min(1, pct));
    const offset = GAUGE_CIRC * (1 - clamped);
    return html`
      <div class="ring-gauge">
        <div class="ring-wrap">
          <svg viewBox="0 0 100 100">
            <circle class="track" cx="50" cy="50" r="${GAUGE_R}" />
            <circle class="fill" cx="50" cy="50" r="${GAUGE_R}"
              style="stroke: ${color}; stroke-dashoffset: ${offset}; filter: drop-shadow(0 0 6px ${color}60)" />
          </svg>
          <div class="ring-center">
            <span class="ring-value" style="color: ${color}">${textLabel}</span>
          </div>
        </div>
        <span class="ring-name">${label}</span>
      </div>
    `;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const seeingVal = Number(this._getState(this._entity(this._config.seeing_entity, "seeing"))) || 0;
    const transVal = Number(this._getState(this._entity(this._config.transparency_entity, "transparency"))) || 0;
    const cloudVal = Number(this._getState(this._entity(this._config.cloud_cover_entity, "cloud_cover"))) || 0;
    const tempState = this._getState(this._entity(this._config.temperature_entity, "temperature"));
    const dewState = this._getState(this._entity(this._config.dew_point_entity, "dew_point"));
    const windState = this._getState(this._entity(this._config.wind_speed_entity, "wind_speed"));
    const windDir = this._getAttr(this._entity(this._config.wind_direction_entity, "wind_direction"), "cardinal") as string || "";

    const seeingLbl = SEEING_LABELS[Math.round(seeingVal)] || "Unknown";
    const transLbl = transparencyLabel(transVal);

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title || "Sky Conditions"}</span>
        </div>
        <div class="content">
          <div class="gauges">
            ${this._renderRingGauge("Seeing", seeingVal / 5, seeingLbl, seeingColor(seeingVal))}
            ${this._renderRingGauge("Transparency", Math.max(0, 1 - transVal / 27), transLbl, transparencyColor(transVal))}
            ${this._renderRingGauge("Cloud Cover", Math.max(0, 1 - cloudVal / 100), `${cloudVal}%`, cloudCoverColor(cloudVal))}
          </div>
          <div class="weather-row">
            ${tempState !== undefined ? html`
              <div class="weather-chip">
                <ha-icon icon="mdi:thermometer"></ha-icon>
                <span>${tempState}&deg;</span>
              </div>
            ` : nothing}
            ${dewState !== undefined ? html`
              <div class="weather-chip">
                <ha-icon icon="mdi:water-outline"></ha-icon>
                <span>${dewState}&deg;</span>
              </div>
            ` : nothing}
            ${windState !== undefined ? html`
              <div class="weather-chip">
                <ha-icon icon="mdi:weather-windy"></ha-icon>
                <span>${windState} ${windDir}</span>
              </div>
            ` : nothing}
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
    .header { padding-bottom: 16px; }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .content { display: flex; flex-direction: column; gap: 20px; }
    .gauges { display: flex; justify-content: space-around; }
    .ring-gauge {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .ring-wrap {
      position: relative; width: 100px; height: 100px;
    }
    .ring-wrap svg {
      width: 100%; height: 100%; transform: rotate(-90deg);
    }
    .track {
      fill: none; stroke: rgba(255, 255, 255, 0.06); stroke-width: 7;
    }
    .fill {
      fill: none; stroke-width: 7; stroke-linecap: round;
      stroke-dasharray: ${unsafeCSS(GAUGE_CIRC.toFixed(1))};
      transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease;
    }
    .ring-center {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .ring-value {
      font-size: 0.82em; font-weight: 700; text-align: center; line-height: 1.2;
    }
    .ring-name {
      font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.6px;
      color: ${unsafeCSS(ASTRO_COLORS.textSecondary)};
    }
    .weather-row {
      display: flex; justify-content: center; gap: 10px;
      padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .weather-chip {
      display: flex; align-items: center; gap: 5px;
      font-size: 0.82em; color: ${unsafeCSS(ASTRO_COLORS.textSecondary)};
      background: rgba(255, 255, 255, 0.04); padding: 5px 12px;
      border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .weather-chip ha-icon { --mdc-icon-size: 16px; }
  `;
}

customElements.define("astrospheric-conditions-card", AstrosphericConditionsCard);
