"""Constants for the Astrospheric integration."""

from datetime import timedelta
import logging

LOGGER = logging.getLogger(__package__)

DOMAIN = "astrospheric"

# API
API_BASE_URL = "https://astrosphericpublicaccess.azurewebsites.net/api"
ENDPOINT_FORECAST = f"{API_BASE_URL}/GetForecastData_V1"
ENDPOINT_SKY = f"{API_BASE_URL}/GetSky_V1"

# Config keys
CONF_API_KEY = "api_key"
CONF_LATITUDE = "latitude"
CONF_LONGITUDE = "longitude"
CONF_SKY_POLL_INTERVAL = "sky_poll_interval"

# Update intervals
UPDATE_INTERVAL_FORECAST = timedelta(hours=6)
DEFAULT_SKY_POLL_MINUTES = 30

# Credits
CREDIT_LIMIT = 100
CREDIT_GUARD_THRESHOLD = 85

# Forecast data keys
FORECAST_CLOUD_COVER = "RDPS_CloudCover"
FORECAST_TRANSPARENCY = "Astrospheric_Transparency"
FORECAST_SEEING = "Astrospheric_Seeing"
FORECAST_TEMPERATURE = "RDPS_Temperature"
FORECAST_DEW_POINT = "RDPS_DewPoint"
FORECAST_WIND_VELOCITY = "RDPS_WindVelocity"
FORECAST_WIND_DIRECTION = "RDPS_WindDirection"

# Seeing scale labels (0-5)
SEEING_LABELS: dict[int, str] = {
    0: "Cloudy",
    1: "Poor",
    2: "Below Average",
    3: "Average",
    4: "Above Average",
    5: "Excellent",
}

# Transparency scale labels
TRANSPARENCY_THRESHOLDS: list[tuple[int, str]] = [
    (5, "Excellent"),
    (9, "Above Average"),
    (13, "Average"),
    (23, "Below Average"),
    (27, "Poor"),
]
TRANSPARENCY_CLOUDY_LABEL = "Cloudy"


def transparency_label(value: int) -> str:
    """Map a transparency value to its label."""
    for threshold, label in TRANSPARENCY_THRESHOLDS:
        if value <= threshold:
            return label
    return TRANSPARENCY_CLOUDY_LABEL


# Moon phase labels (0.0 - 1.0)
MOON_PHASES: list[tuple[float, str]] = [
    (0.0625, "New Moon"),
    (0.1875, "Waxing Crescent"),
    (0.3125, "First Quarter"),
    (0.4375, "Waxing Gibbous"),
    (0.5625, "Full Moon"),
    (0.6875, "Waning Gibbous"),
    (0.8125, "Last Quarter"),
    (0.9375, "Waning Crescent"),
]


def moon_phase_label(phase: float) -> str:
    """Map a 0-1 phase float to a moon phase name."""
    for threshold, label in MOON_PHASES:
        if phase < threshold:
            return label
    return "New Moon"


# Wind cardinal directions (16-point compass)
WIND_CARDINALS: list[tuple[float, str]] = [
    (11.25, "N"),
    (33.75, "NNE"),
    (56.25, "NE"),
    (78.75, "ENE"),
    (101.25, "E"),
    (123.75, "ESE"),
    (146.25, "SE"),
    (168.75, "SSE"),
    (191.25, "S"),
    (213.75, "SSW"),
    (236.25, "SW"),
    (258.75, "WSW"),
    (281.25, "W"),
    (303.75, "WNW"),
    (326.25, "NW"),
    (348.75, "NNW"),
]


def wind_cardinal(degrees: float) -> str:
    """Convert wind direction in degrees to cardinal direction string."""
    for threshold, label in WIND_CARDINALS:
        if degrees < threshold:
            return label
    return "N"


# Platforms
PLATFORMS = ["sensor"]
