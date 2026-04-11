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

  private _getState(entityId?: string): string | undefined {
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId]?.state;
  }

  private _getAttr(entityId: string | undefined, attr: string): unknown {
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId]?.attributes[attr];
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const seeingVal = Number(this._getState(this._config.seeing_entity)) || 0;
    const transVal = Number(this._getState(this._config.transparency_entity)) || 0;
    const cloudVal = Number(this._getState(this._config.cloud_cover_entity)) || 0;
    const tempState = this._getState(this._config.temperature_entity);
    const dewState = this._getState(this._config.dew_point_entity);
    const windState = this._getState(this._config.wind_speed_entity);
    const windDir = this._getAttr(this._config.wind_direction_entity, "cardinal") as string || "";

    const seeingLabel = SEEING_LABELS[Math.round(seeingVal)] || "Unknown";
    const transLabel = transparencyLabel(transVal);

    return html`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title || "Sky Conditions"}</span>
        </div>
        <div class="card-content">
          <div class="gauges">
            ${this._renderGauge("Seeing", seeingVal, 5, seeingLabel, seeingColor(seeingVal))}
            ${this._renderGauge("Transparency", transVal, 27, transLabel, transparencyColor(transVal))}
            ${this._renderGauge("Cloud Cover", cloudVal, 100, `${cloudVal}%`, cloudCoverColor(cloudVal))}
          </div>
          <div class="compact-row">
            ${tempState !== undefined ? html`
              <div class="compact-item">
                <ha-icon icon="mdi:thermometer"></ha-icon>
                <span>${tempState}&deg;</span>
              </div>
            ` : nothing}
            ${dewState !== undefined ? html`
              <div class="compact-item">
                <ha-icon icon="mdi:thermometer-water"></ha-icon>
                <span>${dewState}&deg;</span>
              </div>
            ` : nothing}
            ${windState !== undefined ? html`
              <div class="compact-item">
                <ha-icon icon="mdi:weather-windy"></ha-icon>
                <span>${windState} ${windDir}</span>
              </div>
            ` : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderGauge(label: string, value: number, max: number, textLabel: string, color: string) {
    const pct = Math.min(100, (value / max) * 100);
    return html`
      <div class="gauge">
        <div class="gauge-label">${label}</div>
        <div class="gauge-track">
          <div class="gauge-fill" style="width: ${pct}%; background: ${color}"></div>
        </div>
        <div class="gauge-value" style="color: ${color}">${textLabel}</div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, ${unsafeCSS(ASTRO_COLORS.bgCard)});
      color: var(--primary-text-color, ${unsafeCSS(ASTRO_COLORS.textPrimary)});
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
    .gauges {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .gauge {
      display: grid;
      grid-template-columns: 110px 1fr 90px;
      align-items: center;
      gap: 12px;
    }
    .gauge-label {
      font-size: 0.9em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .gauge-track {
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      overflow: hidden;
    }
    .gauge-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease, background 0.6s ease;
    }
    .gauge-value {
      font-size: 0.85em;
      font-weight: 600;
      text-align: right;
    }
    .compact-row {
      display: flex;
      justify-content: space-around;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(255,255,255,0.06));
    }
    .compact-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .compact-item ha-icon {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color, #8B8FA3);
    }
  `;
}

customElements.define("astrospheric-conditions-card", AstrosphericConditionsCard);
