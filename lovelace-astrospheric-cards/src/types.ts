/**
 * Shared TypeScript interfaces for Astrospheric Lovelace cards.
 */

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  themes: HassThemes;
  language: string;
  config: HassConfig;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HassThemes {
  darkMode: boolean;
}

export interface HassConfig {
  unit_system: {
    temperature: string;
    length: string;
    wind_speed: string;
  };
}

export interface ForecastPoint {
  datetime: string;
  value: number;
}

export interface PlanetInfo {
  name: string;
  altitude: number;
  azimuth: number;
  magnitude: number;
}

export interface CardConfig {
  type: string;
  [key: string]: unknown;
}

export interface ConditionsCardConfig extends CardConfig {
  cloud_cover_entity?: string;
  seeing_entity?: string;
  transparency_entity?: string;
  temperature_entity?: string;
  dew_point_entity?: string;
  wind_speed_entity?: string;
  wind_direction_entity?: string;
  title?: string;
}

export interface MoonCardConfig extends CardConfig {
  moon_phase_entity?: string;
  moon_illumination_entity?: string;
  moon_altitude_entity?: string;
  moon_azimuth_entity?: string;
  title?: string;
}

export interface SkyMapCardConfig extends CardConfig {
  sun_altitude_entity?: string;
  sun_azimuth_entity?: string;
  moon_altitude_entity?: string;
  moon_azimuth_entity?: string;
  moon_phase_entity?: string;
  visible_planets_entity?: string;
  title?: string;
}

export interface ForecastCardConfig extends CardConfig {
  cloud_cover_entity?: string;
  seeing_entity?: string;
  transparency_entity?: string;
  temperature_entity?: string;
  title?: string;
  hours?: number;
}

export interface TonightCardConfig extends CardConfig {
  seeing_entity?: string;
  transparency_entity?: string;
  cloud_cover_entity?: string;
  seeing_go_threshold?: number;
  transparency_go_threshold?: number;
  cloud_go_threshold?: number;
  seeing_nogo_threshold?: number;
  cloud_nogo_threshold?: number;
  title?: string;
}
