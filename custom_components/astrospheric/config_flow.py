"""Config flow for Astrospheric."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import (
    AstrosphericApiClient,
    AstrosphericApiError,
    AstrosphericAuthError,
    AstrosphericLocationError,
)
from .const import (
    CONF_API_KEY,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SKY_POLL_INTERVAL,
    DEFAULT_SKY_POLL_MINUTES,
    DOMAIN,
    LOGGER,
)


class AstrosphericConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Astrospheric."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial setup step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            error = await self._validate_input(user_input)
            if error is None:
                # Use lat/lon as unique ID to prevent duplicate entries
                unique_id = f"{user_input[CONF_LATITUDE]}_{user_input[CONF_LONGITUDE]}"
                await self.async_set_unique_id(unique_id)
                self._abort_if_unique_id_configured()

                return self.async_create_entry(
                    title=f"Astrospheric ({user_input[CONF_LATITUDE]:.2f}, {user_input[CONF_LONGITUDE]:.2f})",
                    data={
                        CONF_API_KEY: user_input[CONF_API_KEY],
                        CONF_LATITUDE: user_input[CONF_LATITUDE],
                        CONF_LONGITUDE: user_input[CONF_LONGITUDE],
                    },
                    options={
                        CONF_SKY_POLL_INTERVAL: user_input.get(
                            CONF_SKY_POLL_INTERVAL, DEFAULT_SKY_POLL_MINUTES
                        ),
                    },
                )
            errors["base"] = error

        # Default lat/lon to HA's configured home location
        default_lat = self.hass.config.latitude
        default_lon = self.hass.config.longitude

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_API_KEY): str,
                    vol.Required(CONF_LATITUDE, default=default_lat): vol.Coerce(float),
                    vol.Required(CONF_LONGITUDE, default=default_lon): vol.Coerce(float),
                    vol.Optional(
                        CONF_SKY_POLL_INTERVAL, default=DEFAULT_SKY_POLL_MINUTES
                    ): vol.All(vol.Coerce(int), vol.Range(min=5, max=60)),
                }
            ),
            errors=errors,
        )

    async def _validate_input(self, user_input: dict[str, Any]) -> str | None:
        """Validate the user input by making a test API call.

        Returns an error key string or None if valid.
        """
        session = async_get_clientsession(self.hass)
        client = AstrosphericApiClient(
            session=session,
            api_key=user_input[CONF_API_KEY],
            latitude=user_input[CONF_LATITUDE],
            longitude=user_input[CONF_LONGITUDE],
        )

        try:
            await client.validate_credentials()
        except AstrosphericAuthError:
            return "invalid_auth"
        except AstrosphericLocationError:
            return "location_error"
        except AstrosphericApiError as err:
            LOGGER.error("API validation failed: %s", err)
            return "cannot_connect"

        # Warn if sky poll interval is very low
        interval = user_input.get(CONF_SKY_POLL_INTERVAL, DEFAULT_SKY_POLL_MINUTES)
        if interval < 15:
            LOGGER.warning(
                "Sky poll interval set to %d minutes — this may use credits quickly",
                interval,
            )

        return None

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Return the options flow handler."""
        return AstrosphericOptionsFlow()


class AstrosphericOptionsFlow(OptionsFlow):
    """Handle Astrospheric options (reconfiguration)."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage options."""
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_SKY_POLL_INTERVAL,
                        default=self.config_entry.options.get(
                            CONF_SKY_POLL_INTERVAL, DEFAULT_SKY_POLL_MINUTES
                        ),
                    ): vol.All(vol.Coerce(int), vol.Range(min=5, max=60)),
                }
            ),
        )
