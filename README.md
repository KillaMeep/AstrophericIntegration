<div align="center">

# Astrospheric for Home Assistant

Astronomy weather sensors and Lovelace cards powered by [Astrospheric](https://astrospheric.com)

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/KillaMeep/AstrophericIntegration?style=for-the-badge)](https://github.com/KillaMeep/AstrophericIntegration/releases)
[![License: MIT](https://img.shields.io/github/license/KillaMeep/AstrophericIntegration?style=for-the-badge)](LICENSE)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1+-blue?style=for-the-badge&logo=homeassistant)](https://www.home-assistant.io/)

</div>

---

A custom Home Assistant integration that connects to the Astrospheric Data API, exposing astronomy-relevant weather and sky data as sensors. Built for astronomers and astrophotographers who want to automate observing decisions.

## Features

**Integration**
- 17 sensors covering forecast weather, sky conditions, and celestial positions
- Two data coordinators: Forecast (6-hour poll) and Sky (30-minute poll)
- Automatic credit management with a credit guard that suspends polling at 85/100 credits
- Persistent caching -- survives HA restarts without burning API credits
- Automatic unit conversion -- temperature and wind speed follow your HA unit preferences
- Full 81-hour forecast arrays as sensor attributes for charting

**Lovelace Cards** (bundled with the integration)
- **Sky Conditions Card** -- Gauges for seeing, transparency, cloud cover with color-coded ratings
- **Moon Phase Card** -- SVG moon visualization with phase name, illumination, and position
- **Celestial Sky Map** -- Polar projection showing sun, moon, and planets on an altitude/azimuth plot
- **Forecast Timeline** -- 81-hour interactive chart with cloud cover, seeing, and transparency overlay
- **Tonight's Summary** -- GO / MARGINAL / NO-GO badge with configurable thresholds

---

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click **Integrations** > three-dot menu > **Custom repositories**
3. Add `https://github.com/KillaMeep/AstrophericIntegration` -- Category: **Integration**
4. Search for **Astrospheric** and install
5. Restart Home Assistant
6. Go to **Settings** > **Devices & Services** > **Add Integration** > search "Astrospheric"

### Manual

1. Copy the `custom_components/astrospheric/` folder into your Home Assistant `config/custom_components/` directory
2. Restart Home Assistant
3. Add via **Settings** > **Devices & Services**

### Lovelace Cards

The Lovelace cards are **bundled with the integration** and automatically served by Home Assistant. No separate download is required.

After installing the integration, add the card resource:

1. Go to **Settings** > **Dashboards** > **Resources** (top right three-dot menu)
2. Click **Add Resource**
3. Set the URL to:
   ```
   /astrospheric/astrospheric-cards.js
   ```
4. Set the type to **JavaScript Module**
5. Click **Create**

All five card types will then be available in the Lovelace card picker.

---

## Configuration

### Setup

During setup you will be asked for:

| Field | Description | Default |
|-------|-------------|---------|
| **API Key** | Your Astrospheric Professional API key | Required |
| **Latitude** | Observing location latitude | HA home latitude |
| **Longitude** | Observing location longitude | HA home longitude |
| **Sky poll interval** | Minutes between sky position updates (5--60) | 30 |

The API key is validated during setup with a test API call. The location must be within the RDPS model domain (North America).

### Options

After setup, you can change the sky poll interval via **Settings** > **Devices & Services** > **Astrospheric** > **Configure**.

---

## Sensors

### Forecast Sensors (updated every 6 hours)

| Sensor | Unit | Description |
|--------|------|-------------|
| `sensor.astrospheric_cloud_cover` | % | 0 = clear, 100 = overcast |
| `sensor.astrospheric_seeing` | 0--5 | Atmospheric stability (5 = Excellent) |
| `sensor.astrospheric_transparency` | 0--27+ | Atmospheric clarity (0 = Excellent) |
| `sensor.astrospheric_temperature` | C/F | Auto-converted from Kelvin |
| `sensor.astrospheric_dew_point` | C/F | Auto-converted from Kelvin |
| `sensor.astrospheric_wind_speed` | m/s or mph | Auto-converted |
| `sensor.astrospheric_wind_direction` | deg | Includes `cardinal` attribute (N, NE, etc.) |
| `sensor.astrospheric_model_run` | -- | Current model run identifier (diagnostic) |

All forecast sensors include a `forecast` attribute with the full 81-hour array.

### Sky Sensors (updated every 30 minutes)

| Sensor | Unit | Description |
|--------|------|-------------|
| `sensor.astrospheric_moon_phase` | -- | Phase name (New Moon, Waxing Crescent, etc.) |
| `sensor.astrospheric_moon_illumination` | % | 0 = new, 100 = full |
| `sensor.astrospheric_moon_altitude` | deg | Negative = below horizon |
| `sensor.astrospheric_moon_azimuth` | deg | 0--359 |
| `sensor.astrospheric_sun_altitude` | deg | Negative = below horizon |
| `sensor.astrospheric_sun_azimuth` | deg | 0--359 |
| `sensor.astrospheric_visible_planets` | count | Includes `planets` attribute with details |
| `sensor.astrospheric_credits_used_today` | credits | Diagnostic |
| `sensor.astrospheric_credits_remaining` | credits | Diagnostic (100 - used) |

---

## Card Configuration

### Sky Conditions Card

```yaml
type: custom:astrospheric-conditions-card
title: Sky Conditions
cloud_cover_entity: sensor.astrospheric_cloud_cover
seeing_entity: sensor.astrospheric_seeing
transparency_entity: sensor.astrospheric_transparency
temperature_entity: sensor.astrospheric_temperature
dew_point_entity: sensor.astrospheric_dew_point
wind_speed_entity: sensor.astrospheric_wind_speed
wind_direction_entity: sensor.astrospheric_wind_direction
```

### Moon Phase Card

```yaml
type: custom:astrospheric-moon-card
moon_phase_entity: sensor.astrospheric_moon_phase
moon_illumination_entity: sensor.astrospheric_moon_illumination
moon_altitude_entity: sensor.astrospheric_moon_altitude
moon_azimuth_entity: sensor.astrospheric_moon_azimuth
```

### Sky Map Card

```yaml
type: custom:astrospheric-sky-map-card
sun_altitude_entity: sensor.astrospheric_sun_altitude
sun_azimuth_entity: sensor.astrospheric_sun_azimuth
moon_altitude_entity: sensor.astrospheric_moon_altitude
moon_azimuth_entity: sensor.astrospheric_moon_azimuth
visible_planets_entity: sensor.astrospheric_visible_planets
```

### Forecast Card

```yaml
type: custom:astrospheric-forecast-card
cloud_cover_entity: sensor.astrospheric_cloud_cover
seeing_entity: sensor.astrospheric_seeing
transparency_entity: sensor.astrospheric_transparency
```

### Tonight Card

```yaml
type: custom:astrospheric-tonight-card
seeing_entity: sensor.astrospheric_seeing
transparency_entity: sensor.astrospheric_transparency
cloud_cover_entity: sensor.astrospheric_cloud_cover
seeing_go_threshold: 4
transparency_go_threshold: 9
cloud_go_threshold: 20
seeing_nogo_threshold: 2
cloud_nogo_threshold: 70
```

---

## Automation Examples

### Notify when seeing is excellent

```yaml
automation:
  - alias: "Astrospheric: Good seeing alert"
    trigger:
      - platform: numeric_state
        entity_id: sensor.astrospheric_seeing
        above: 3
    condition:
      - condition: numeric_state
        entity_id: sensor.astrospheric_cloud_cover
        below: 30
    action:
      - service: notify.mobile_app
        data:
          title: "Clear Skies Tonight!"
          message: "Seeing: {{ states('sensor.astrospheric_seeing') }}/5, Clouds: {{ states('sensor.astrospheric_cloud_cover') }}%"
```

### Red light on moon rise

```yaml
automation:
  - alias: "Moon rise indicator"
    trigger:
      - platform: numeric_state
        entity_id: sensor.astrospheric_moon_altitude
        above: 0
    action:
      - service: light.turn_on
        target:
          entity_id: light.observatory_warning
        data:
          color_name: red
```

---

## Credit Budget

The Astrospheric API allows **100 credits per day** (resets at midnight UTC).

| Endpoint | Calls / Day | Credits |
|----------|-------------|---------|
| `GetForecastData_V1` | 4 (every 6 hours) | 20 |
| `GetSky_V1` | 48 (every 30 min) | 48 |
| **Total** | | **68 / 100** |

A credit guard automatically suspends all polling when **85 credits** are used, leaving a comfortable buffer for retries, restarts, and options flow re-validation.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made by [KillaMeep](https://github.com/KillaMeep)

</div>
