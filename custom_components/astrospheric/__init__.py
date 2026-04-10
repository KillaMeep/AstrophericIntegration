"""The Astrospheric integration."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_utc_time_change

from .api import AstrosphericApiClient
from .const import (
    CONF_API_KEY,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SKY_POLL_INTERVAL,
    DEFAULT_SKY_POLL_MINUTES,
    DOMAIN,
    LOGGER,
    PLATFORMS,
)
from .coordinator_forecast import ForecastCoordinator
from .coordinator_sky import SkyCoordinator

CARDS_JS = "astrospheric-cards.js"
CARDS_URL = f"/astrospheric/{CARDS_JS}"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Astrospheric from a config entry."""
    session = async_get_clientsession(hass)

    client = AstrosphericApiClient(
        session=session,
        api_key=entry.data[CONF_API_KEY],
        latitude=entry.data[CONF_LATITUDE],
        longitude=entry.data[CONF_LONGITUDE],
    )

    # Initialize shared domain data
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN].setdefault("credit_guard_active", False)

    # Create coordinators
    forecast_coordinator = ForecastCoordinator(hass, entry, client)
    sky_poll_minutes = entry.options.get(CONF_SKY_POLL_INTERVAL, DEFAULT_SKY_POLL_MINUTES)
    sky_coordinator = SkyCoordinator(hass, entry, client, sky_poll_minutes)

    # First refresh — loads cache or fetches from API
    await forecast_coordinator.async_config_entry_first_refresh()
    await sky_coordinator.async_config_entry_first_refresh()

    # Store coordinators for sensor platform and unload
    hass.data[DOMAIN][entry.entry_id] = {
        "forecast": forecast_coordinator,
        "sky": sky_coordinator,
    }

    # Schedule credit guard reset at midnight UTC
    def _reset_credit_guard(now: datetime) -> None:
        """Reset the credit guard at midnight UTC."""
        LOGGER.info("Midnight UTC — resetting credit guard")
        hass.data[DOMAIN]["credit_guard_active"] = False

    entry.async_on_unload(
        async_track_utc_time_change(hass, _reset_credit_guard, hour=0, minute=0, second=0)
    )

    # Listen for options updates (sky poll interval change)
    entry.async_on_unload(entry.add_update_listener(_async_update_options))

    # Forward setup to sensor platform
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register bundled Lovelace card JS
    _register_cards(hass)

    return True


async def _async_update_options(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update — reload the integration."""
    await hass.config_entries.async_reload(entry.entry_id)


def _register_cards(hass: HomeAssistant) -> None:
    """Register the bundled Lovelace card JS as a static resource."""
    # Only register once (multiple config entries should not re-register)
    if hass.data[DOMAIN].get("cards_registered"):
        return

    www_dir = Path(__file__).parent / "www"
    js_path = www_dir / CARDS_JS
    if not js_path.is_file():
        LOGGER.warning("Lovelace card JS not found at %s — skipping registration", js_path)
        return

    # Serve the JS file at /astrospheric/astrospheric-cards.js
    hass.http.register_static_path(CARDS_URL, str(js_path), cache_headers=False)

    hass.data[DOMAIN]["cards_registered"] = True
    LOGGER.info(
        "Registered Lovelace cards at %s — add as a resource in your dashboard: "
        "URL: %s, Type: JavaScript Module",
        CARDS_URL,
        CARDS_URL,
    )


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload Astrospheric config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok
