import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, MoonCardConfig } from "../types.js";
import { ASTRO_COLORS } from "../utils/theme.js";
import { moonPhaseSVG } from "../utils/moon-svg.js";

class AstrosphericMoonCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: MoonCardConfig;

  setConfig(config: MoonCardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 4;
  }

  static getConfigElement() {
    return document.createElement("astrospheric-moon-editor");
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

    const phaseName = this._getState(this._config.moon_phase_entity) || "Unknown";
    const phaseValue = Number(this._getAttr(this._config.moon_phase_entity, "phase_value")) || 0;
    const illumination = Number(this._getState(this._config.moon_illumination_entity)) || 0;
    const altitude = Number(this._getState(this._config.moon_altitude_entity)) || 0;
    const azimuth = Number(this._getState(this._config.moon_azimuth_entity)) || 0;

    const moonSVG = moonPhaseSVG(phaseValue, illumination, 120);
    const isBelowHorizon = altitude < 0;

    return html`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title || "Moon"}</span>
        </div>
        <div class="card-content">
          <div class="moon-visual" .innerHTML=${moonSVG}></div>
          <div class="phase-name">${phaseName}</div>
          <div class="illumination">${illumination.toFixed(1)}% illuminated</div>
          <div class="position-row">
            <div class="pos-item">
              <span class="pos-label">Altitude</span>
              <span class="pos-value ${isBelowHorizon ? 'below' : ''}">${altitude.toFixed(1)}&deg;</span>
              ${isBelowHorizon ? html`<span class="below-tag">Below horizon</span>` : nothing}
            </div>
            <div class="pos-item">
              <span class="pos-label">Azimuth</span>
              <span class="pos-value">${azimuth.toFixed(1)}&deg;</span>
            </div>
          </div>
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
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .moon-visual {
      margin: 8px 0;
      filter: drop-shadow(0 0 12px rgba(255, 248, 225, 0.15));
    }
    .moon-visual svg {
      display: block;
    }
    .phase-name {
      font-size: 1.2em;
      font-weight: 600;
      color: #FFF8E1;
    }
    .illumination {
      font-size: 0.9em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .position-row {
      display: flex;
      gap: 32px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(255,255,255,0.06));
    }
    .pos-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .pos-label {
      font-size: 0.75em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .pos-value {
      font-size: 1.1em;
      font-weight: 600;
    }
    .pos-value.below {
      color: #FF9100;
    }
    .below-tag {
      font-size: 0.7em;
      color: #FF9100;
      background: rgba(255, 145, 0, 0.12);
      padding: 1px 6px;
      border-radius: 4px;
    }
  `;
}

customElements.define("astrospheric-moon-card", AstrosphericMoonCard);
