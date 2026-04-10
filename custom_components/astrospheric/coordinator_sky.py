"""Sky data coordinator for Astrospheric."""

from __future__ import annotations

import time
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import AstrosphericApiClient, AstrosphericApiError, AstrosphericAuthError
from .const import CREDIT_GUARD_THRESHOLD, DEFAULT_SKY_POLL_MINUTES, DOMAIN, LOGGER


class SkyCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator that polls GetSky_V1 every N minutes."""

    config_entry: ConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: ConfigEntry,
        client: AstrosphericApiClient,
        poll_interval_minutes: int = DEFAULT_SKY_POLL_MINUTES,
    ) -> None:
        """Initialize the sky coordinator."""
        super().__init__(
            hass,
            LOGGER,
            name=f"{DOMAIN}_sky",
            update_interval=timedelta(minutes=poll_interval_minutes),
            config_entry=config_entry,
        )
        self.client = client
        self._credits_used: int = 0

    @property
    def credits_used(self) -> int:
        """Return the last known credit usage."""
        return self._credits_used

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch sky data from the API."""
        # Check credit guard
        credit_guard = self.hass.data.get(DOMAIN, {}).get("credit_guard_active", False)
        if credit_guard:
            LOGGER.warning("Credit guard active — skipping sky poll")
            if self.data:
                return self.data
            raise UpdateFailed("Credit guard active and no cached data")

        timestamp_ms = int(time.time() * 1000)

        try:
            data = await self.client.get_sky(timestamp_ms)
        except AstrosphericAuthError as err:
            raise ConfigEntryAuthFailed(str(err)) from err
        except AstrosphericApiError as err:
            raise UpdateFailed(str(err)) from err

        # Update credit tracking
        self._credits_used = data.get("APICreditUsedToday", 0)
        self._update_credit_guard()

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

    def get_moon(self) -> dict[str, Any] | None:
        """Return Moon data dict or None."""
        if self.data:
            return self.data.get("Moon")
        return None

    def get_sun(self) -> dict[str, Any] | None:
        """Return Sun data dict or None."""
        if self.data:
            return self.data.get("Sun")
        return None

    def get_planets(self) -> list[dict[str, Any]]:
        """Return list of planets currently above the horizon."""
        if not self.data:
            return []
        objects = self.data.get("Planet_Star", [])
        return [obj for obj in objects if obj.get("Type") == 1]

    def get_stars(self) -> list[dict[str, Any]]:
        """Return list of visible stars."""
        if not self.data:
            return []
        objects = self.data.get("Planet_Star", [])
        return [obj for obj in objects if obj.get("Type") == 0]
