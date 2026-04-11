"""Sensor platform for Astrospheric."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    DEGREE,
    PERCENTAGE,
    EntityCategory,
    UnitOfSpeed,
    UnitOfTemperature,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    CREDIT_LIMIT,
    DOMAIN,
    FORECAST_CLOUD_COVER,
    FORECAST_DEW_POINT,
    FORECAST_SEEING,
    FORECAST_TEMPERATURE,
    FORECAST_TRANSPARENCY,
    FORECAST_WIND_DIRECTION,
    FORECAST_WIND_VELOCITY,
    SEEING_LABELS,
    moon_phase_label,
    transparency_label,
    wind_cardinal,
)
from .coordinator_forecast import ForecastCoordinator
from .coordinator_sky import SkyCoordinator


def _moon_val(c: SkyCoordinator, key: str, ndigits: int | None = None):
    """Safely extract a moon field from the sky coordinator."""
    moon = c.get_moon()
    if not moon:
        return None
    val = moon.get(key)
    if val is None:
        return None
    return round(val, ndigits) if ndigits is not None else val


def _sun_val(c: SkyCoordinator, key: str, ndigits: int = 2):
    """Safely extract a sun field from the sky coordinator."""
    sun = c.get_sun()
    if not sun:
        return None
    val = sun.get(key)
    if val is None:
        return None
    return round(val, ndigits)


@dataclass(frozen=True, kw_only=True)
class AstrosphericForecastSensorDescription(SensorEntityDescription):
    """Describe an Astrospheric forecast sensor."""

    forecast_key: str
    value_fn: Callable[[ForecastCoordinator], Any] | None = None
    extra_attrs_fn: Callable[[ForecastCoordinator], dict[str, Any]] | None = None


@dataclass(frozen=True, kw_only=True)
class AstrosphericSkySensorDescription(SensorEntityDescription):
    """Describe an Astrospheric sky sensor."""

    value_fn: Callable[[SkyCoordinator], Any]
    extra_attrs_fn: Callable[[SkyCoordinator], dict[str, Any]] | None = None


def _forecast_extra_attrs(key: str) -> Callable[[ForecastCoordinator], dict[str, Any]]:
    """Return a function that gets the forecast array as extra attributes."""
    def _get(coordinator: ForecastCoordinator) -> dict[str, Any]:
        return {"forecast": coordinator.get_forecast_array(key)}
    return _get


FORECAST_SENSORS: tuple[AstrosphericForecastSensorDescription, ...] = (
    AstrosphericForecastSensorDescription(
        key="cloud_cover",
        translation_key="cloud_cover",
        forecast_key=FORECAST_CLOUD_COVER,
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:weather-cloudy",
        extra_attrs_fn=_forecast_extra_attrs(FORECAST_CLOUD_COVER),
    ),
    AstrosphericForecastSensorDescription(
        key="seeing",
        translation_key="seeing",
        forecast_key=FORECAST_SEEING,
        icon="mdi:telescope",
        state_class=SensorStateClass.MEASUREMENT,
        extra_attrs_fn=lambda c: {
            "label": SEEING_LABELS.get(
                c.get_current_value(FORECAST_SEEING), "Unknown"
            ),
            "forecast": c.get_forecast_array(FORECAST_SEEING),
        },
    ),
    AstrosphericForecastSensorDescription(
        key="transparency",
        translation_key="transparency",
        forecast_key=FORECAST_TRANSPARENCY,
        icon="mdi:eye",
        state_class=SensorStateClass.MEASUREMENT,
        extra_attrs_fn=lambda c: {
            "label": transparency_label(
                c.get_current_value(FORECAST_TRANSPARENCY) or 0
            ),
            "forecast": c.get_forecast_array(FORECAST_TRANSPARENCY),
        },
    ),
    AstrosphericForecastSensorDescription(
        key="temperature",
        translation_key="temperature",
        forecast_key=FORECAST_TEMPERATURE,
        device_class=SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.KELVIN,
        state_class=SensorStateClass.MEASUREMENT,
        extra_attrs_fn=_forecast_extra_attrs(FORECAST_TEMPERATURE),
    ),
    AstrosphericForecastSensorDescription(
        key="dew_point",
        translation_key="dew_point",
        forecast_key=FORECAST_DEW_POINT,
        device_class=SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.KELVIN,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:thermometer-water",
        extra_attrs_fn=_forecast_extra_attrs(FORECAST_DEW_POINT),
    ),
    AstrosphericForecastSensorDescription(
        key="wind_speed",
        translation_key="wind_speed",
        forecast_key=FORECAST_WIND_VELOCITY,
        device_class=SensorDeviceClass.WIND_SPEED,
        native_unit_of_measurement=UnitOfSpeed.METERS_PER_SECOND,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:weather-windy",
        extra_attrs_fn=_forecast_extra_attrs(FORECAST_WIND_VELOCITY),
    ),
    AstrosphericForecastSensorDescription(
        key="wind_direction",
        translation_key="wind_direction",
        forecast_key=FORECAST_WIND_DIRECTION,
        native_unit_of_measurement=DEGREE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:compass",
        extra_attrs_fn=lambda c: {
            "cardinal": wind_cardinal(
                c.get_current_value(FORECAST_WIND_DIRECTION) or 0
            ),
            "forecast": c.get_forecast_array(FORECAST_WIND_DIRECTION),
        },
    ),
    AstrosphericForecastSensorDescription(
        key="model_run",
        translation_key="model_run",
        forecast_key="ModelTime",
        icon="mdi:clock-outline",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda c: c.data.get("ModelTime") if c.data else None,
    ),
)

SKY_SENSORS: tuple[AstrosphericSkySensorDescription, ...] = (
    AstrosphericSkySensorDescription(
        key="moon_phase",
        translation_key="moon_phase",
        icon="mdi:moon-waning-crescent",
        value_fn=lambda c: moon_phase_label(_moon_val(c, "Phase") or 0),
        extra_attrs_fn=lambda c: {
            "phase_value": _moon_val(c, "Phase"),
        },
    ),
    AstrosphericSkySensorDescription(
        key="moon_illumination",
        translation_key="moon_illumination",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:moon-full",
        value_fn=lambda c: _moon_val(c, "Illumination", 1),
    ),
    AstrosphericSkySensorDescription(
        key="moon_altitude",
        translation_key="moon_altitude",
        native_unit_of_measurement=DEGREE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:moon-waxing-crescent",
        value_fn=lambda c: _moon_val(c, "Altitude", 2),
    ),
    AstrosphericSkySensorDescription(
        key="moon_azimuth",
        translation_key="moon_azimuth",
        native_unit_of_measurement=DEGREE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:compass",
        value_fn=lambda c: _moon_val(c, "Azimuth", 2),
    ),
    AstrosphericSkySensorDescription(
        key="sun_altitude",
        translation_key="sun_altitude",
        native_unit_of_measurement=DEGREE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:white-balance-sunny",
        value_fn=lambda c: _sun_val(c, "Altitude", 2),
    ),
    AstrosphericSkySensorDescription(
        key="sun_azimuth",
        translation_key="sun_azimuth",
        native_unit_of_measurement=DEGREE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:compass",
        value_fn=lambda c: _sun_val(c, "Azimuth", 2),
    ),
    AstrosphericSkySensorDescription(
        key="visible_planets",
        translation_key="visible_planets",
        icon="mdi:planet",  # Note: this MDI icon may vary, mdi:earth works too
        value_fn=lambda c: len(c.get_planets()),
        extra_attrs_fn=lambda c: {
            "planets": [
                {
                    "name": p.get("Name"),
                    "altitude": round(p.get("Altitude", 0), 2),
                    "azimuth": round(p.get("Azimuth", 0), 2),
                    "magnitude": p.get("Mag"),
                }
                for p in c.get_planets()
            ]
        },
    ),
    AstrosphericSkySensorDescription(
        key="credits_used_today",
        translation_key="credits_used_today",
        icon="mdi:counter",
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda c: c.credits_used,
    ),
    AstrosphericSkySensorDescription(
        key="credits_remaining",
        translation_key="credits_remaining",
        icon="mdi:counter",
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda c: CREDIT_LIMIT - c.credits_used,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Astrospheric sensors from a config entry."""
    coordinators = hass.data[DOMAIN][entry.entry_id]
    forecast_coordinator: ForecastCoordinator = coordinators["forecast"]
    sky_coordinator: SkyCoordinator = coordinators["sky"]

    entities: list[SensorEntity] = []

    for description in FORECAST_SENSORS:
        entities.append(
            AstrosphericForecastSensor(forecast_coordinator, description, entry)
        )

    for description in SKY_SENSORS:
        entities.append(
            AstrosphericSkySensor(sky_coordinator, description, entry)
        )

    async_add_entities(entities)


class AstrosphericForecastSensor(CoordinatorEntity[ForecastCoordinator], SensorEntity):
    """A sensor backed by the Astrospheric forecast coordinator."""

    entity_description: AstrosphericForecastSensorDescription
    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: ForecastCoordinator,
        description: AstrosphericForecastSensorDescription,
        entry: ConfigEntry,
    ) -> None:
        """Initialize the forecast sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{entry.entry_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Astrospheric",
            manufacturer="Astrospheric",
            model="RDPS Forecast",
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def native_value(self) -> Any | None:
        """Return the current sensor value."""
        desc = self.entity_description
        if desc.value_fn is not None:
            return desc.value_fn(self.coordinator)
        return self.coordinator.get_current_value(desc.forecast_key)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra attributes including the forecast array."""
        desc = self.entity_description
        attrs: dict[str, Any] = {"astrospheric_sensor_type": desc.key}
        if desc.extra_attrs_fn is not None:
            attrs.update(desc.extra_attrs_fn(self.coordinator))
        return attrs


class AstrosphericSkySensor(CoordinatorEntity[SkyCoordinator], SensorEntity):
    """A sensor backed by the Astrospheric sky coordinator."""

    entity_description: AstrosphericSkySensorDescription
    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: SkyCoordinator,
        description: AstrosphericSkySensorDescription,
        entry: ConfigEntry,
    ) -> None:
        """Initialize the sky sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{entry.entry_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Astrospheric",
            manufacturer="Astrospheric",
            model="Sky Data",
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def native_value(self) -> Any | None:
        """Return the current sensor value."""
        return self.entity_description.value_fn(self.coordinator)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        desc = self.entity_description
        attrs: dict[str, Any] = {"astrospheric_sensor_type": desc.key}
        if desc.extra_attrs_fn is not None:
            attrs.update(desc.extra_attrs_fn(self.coordinator))
        return attrs
