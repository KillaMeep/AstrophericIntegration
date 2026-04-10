"""Forecast data coordinator for Astrospheric."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import (
    AstrosphericApiClient,
    AstrosphericApiError,
    AstrosphericAuthError,
    AstrosphericCreditsExhaustedError,
)
from .const import CREDIT_GUARD_THRESHOLD, DOMAIN, LOGGER, UPDATE_INTERVAL_FORECAST

STORAGE_VERSION = 1
STORAGE_KEY_PREFIX = "astrospheric_forecast"


class ForecastCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator that polls GetForecastData_V1 every 6 hours."""

    config_entry: ConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: ConfigEntry,
        client: AstrosphericApiClient,
    ) -> None:
        """Initialize the forecast coordinator."""
        super().__init__(
            hass,
            LOGGER,
            name=f"{DOMAIN}_forecast",
            update_interval=UPDATE_INTERVAL_FORECAST,
            config_entry=config_entry,
        )
        self.client = client
        self._store = Store(
            hass, STORAGE_VERSION, f"{STORAGE_KEY_PREFIX}_{config_entry.entry_id}"
        )
        self._credits_used: int = 0

    @property
    def credits_used(self) -> int:
        """Return the last known credit usage."""
        return self._credits_used

    async def _async_setup(self) -> None:
        """Load cached data on first refresh if still valid."""
        stored: dict[str, Any] | None = await self._store.async_load()
        if stored and self._is_cache_valid(stored):
            LOGGER.debug("Loaded forecast from cache (model run %s)", stored.get("ModelTime"))
            self.async_set_updated_data(stored)

    def _is_cache_valid(self, data: dict[str, Any]) -> bool:
        """Check if cached forecast data is from the current model run."""
        model_time_str = data.get("ModelTime")
        if not model_time_str:
            return False
        try:
            # ModelTime format: YYYYMMDDHH (e.g. "2024041200")
            model_dt = datetime.strptime(model_time_str, "%Y%m%d%H").replace(
                tzinfo=timezone.utc
            )
            age = datetime.now(timezone.utc) - model_dt
            # Valid if less than 7 hours old (6h cycle + 1h grace)
            return age < timedelta(hours=7)
        except (ValueError, TypeError):
            return False

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch forecast data from the API."""
        # Check credit guard
        credit_guard = self.hass.data.get(DOMAIN, {}).get("credit_guard_active", False)
        if credit_guard:
            LOGGER.debug("Credit guard active — skipping forecast poll")
            return self.data if self.data else {}

        try:
            data = await self.client.get_forecast()
        except AstrosphericAuthError as err:
            raise ConfigEntryAuthFailed(str(err)) from err
        except AstrosphericCreditsExhaustedError:
            LOGGER.warning("API credits exhausted — activating credit guard")
            self.hass.data.setdefault(DOMAIN, {})
            self.hass.data[DOMAIN]["credit_guard_active"] = True
            if self.data:
                return self.data
            return {}
        except AstrosphericApiError as err:
            raise UpdateFailed(str(err)) from err

        # Update credit tracking
        self._credits_used = data.get("APICreditUsedToday", 0)
        self._update_credit_guard()

        # Persist to disk
        await self._store.async_save(data)

        return data

    def _update_credit_guard(self) -> None:
        """Activate credit guard if threshold exceeded."""
        self.hass.data.setdefault(DOMAIN, {})
        if self._credits_used >= CREDIT_GUARD_THRESHOLD:
            if not self.hass.data[DOMAIN].get("credit_guard_active"):
                LOGGER.warning(
                    "Credit guard activated: %d/%d credits used",
                    self._credits_used,
                    100,
                )
            self.hass.data[DOMAIN]["credit_guard_active"] = True

    def get_current_hour_index(self) -> int | None:
        """Calculate the current hour index into the 81-hour forecast array.

        Compares UTCStartTime to current UTC time.
        Returns None if data is unavailable or index is out of range.
        """
        if not self.data:
            return None
        utc_start = self.data.get("UTCStartTime")
        if not utc_start:
            return None
        try:
            start_dt = datetime.fromisoformat(utc_start.replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            diff_hours = int((now - start_dt).total_seconds() / 3600)
            if 0 <= diff_hours < 81:
                return diff_hours
        except (ValueError, TypeError):
            pass
        return None

    def get_current_value(self, key: str) -> Any | None:
        """Get the current hour's value for a given forecast key."""
        idx = self.get_current_hour_index()
        if idx is None or not self.data:
            return None
        array = self.data.get(key)
        if array and isinstance(array, list) and idx < len(array):
            return array[idx]
        return None

    def get_forecast_array(self, key: str) -> list[dict[str, Any]]:
        """Return the full forecast array as [{datetime, value}, ...] dicts.

        Useful for chart attributes in sensors.
        """
        if not self.data:
            return []
        utc_start = self.data.get("UTCStartTime")
        array = self.data.get(key)
        if not utc_start or not array or not isinstance(array, list):
            return []
        try:
            start_dt = datetime.fromisoformat(utc_start.replace("Z", "+00:00"))
        except (ValueError, TypeError):
            return []
        return [
            {
                "datetime": (start_dt + timedelta(hours=i)).isoformat(),
                "value": val,
            }
            for i, val in enumerate(array)
        ]
