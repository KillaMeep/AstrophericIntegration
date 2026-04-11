import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, MoonCardConfig } from "../types.js";
import { ASTRO_COLORS } from "../utils/theme.js";
import { moonPhaseSVG } from "../utils/moon-svg.js";
import { degreesToCardinal } from "../utils/astronomy-math.js";

const ILL_R = 82;
const ILL_CIRC = 2 * Math.PI * ILL_R;

class AstrosphericMoonCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: MoonCardConfig;

  setConfig(config: MoonCardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 5;
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      type: "custom:astrospheric-moon-card",
      moon_phase_entity: "",
      moon_illumination_entity: "",
      moon_altitude_entity: "",
      moon_azimuth_entity: "",
    };
  }

  static getConfigElement() {
    return document.createElement("astrospheric-moon-editor");
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

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const moonPhaseId = this._entity(this._config.moon_phase_entity, "moon_phase");
    const phaseName = this._getState(moonPhaseId) || "Unknown";
    const phaseValue = Number(this._getAttr(moonPhaseId, "phase_value")) || 0;
    const illumination = Number(this._getState(this._entity(this._config.moon_illumination_entity, "moon_illumination"))) || 0;
    const altitude = Number(this._getState(this._entity(this._config.moon_altitude_entity, "moon_altitude"))) || 0;
    const azimuth = Number(this._getState(this._entity(this._config.moon_azimuth_entity, "moon_azimuth"))) || 0;

    const moonSVG = moonPhaseSVG(phaseValue, illumination, 150);
    const isBelowHorizon = altitude < 0;
    const cardinal = degreesToCardinal(azimuth);

    const illOffset = ILL_CIRC * (1 - illumination / 100);
    const glowIntensity = illumination > 50 ? "0.2" : "0.12";

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title || "Moon"}</span>
        </div>
        <div class="content">
          <div class="moon-container">
            <svg class="ill-ring" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="${ILL_R}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3" />
              <circle cx="90" cy="90" r="${ILL_R}" fill="none"
                stroke="${ASTRO_COLORS.moon}" stroke-width="3" stroke-linecap="round"
                stroke-dasharray="${ILL_CIRC}" stroke-dashoffset="${illOffset}"
                style="filter: drop-shadow(0 0 4px rgba(255,248,225,0.4)); transition: stroke-dashoffset 1s ease" />
            </svg>
            <div class="moon-visual" style="filter: drop-shadow(0 0 20px rgba(255,248,225,${glowIntensity}))" .innerHTML=${moonSVG}></div>
          </div>
          <div class="phase-name">${phaseName}</div>
          <div class="illumination">${illumination.toFixed(1)}% illuminated</div>
          <div class="position-grid">
            <div class="pos-item">
              <ha-icon icon="${isBelowHorizon ? 'mdi:arrow-down' : 'mdi:arrow-up'}"
                style="--mdc-icon-size: 16px; color: ${isBelowHorizon ? ASTRO_COLORS.belowAvg : ASTRO_COLORS.excellent}"></ha-icon>
              <div class="pos-data">
                <span class="pos-value ${isBelowHorizon ? 'below' : ''}">${altitude.toFixed(1)}&deg;</span>
                <span class="pos-label">${isBelowHorizon ? 'Below horizon' : 'Altitude'}</span>
              </div>
            </div>
            <div class="pos-item">
              <ha-icon icon="mdi:compass-outline"
                style="--mdc-icon-size: 16px; color: ${ASTRO_COLORS.textSecondary}"></ha-icon>
              <div class="pos-data">
                <span class="pos-value">${azimuth.toFixed(1)}&deg; ${cardinal}</span>
                <span class="pos-label">Azimuth</span>
              </div>
            </div>
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
    .header { padding-bottom: 12px; }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .content {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
    }
    .moon-container {
      position: relative; width: 180px; height: 180px;
      display: flex; align-items: center; justify-content: center;
    }
    .ill-ring {
      position: absolute; inset: 0; width: 100%; height: 100%;
      transform: rotate(-90deg);
    }
    .moon-visual { z-index: 1; }
    .moon-visual svg { display: block; }
    .phase-name {
      font-size: 1.3em; font-weight: 600;
      color: ${unsafeCSS(ASTRO_COLORS.moon)};
    }
    .illumination {
      font-size: 0.9em; color: ${unsafeCSS(ASTRO_COLORS.textSecondary)};
    }
    .position-grid {
      display: flex; gap: 28px; margin-top: 12px; padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      width: 100%; justify-content: center;
    }
    .pos-item { display: flex; align-items: center; gap: 8px; }
    .pos-data { display: flex; flex-direction: column; }
    .pos-value { font-size: 1em; font-weight: 600; }
    .pos-value.below { color: ${unsafeCSS(ASTRO_COLORS.belowAvg)}; }
    .pos-label {
      font-size: 0.7em; color: ${unsafeCSS(ASTRO_COLORS.textMuted)};
      text-transform: uppercase; letter-spacing: 0.3px;
    }
  `;
}

customElements.define("astrospheric-moon-card", AstrosphericMoonCard);
