"""Astrospheric API client."""

from __future__ import annotations

import asyncio
from typing import Any

import aiohttp

from .const import ENDPOINT_FORECAST, ENDPOINT_SKY, LOGGER


class AstrosphericApiError(Exception):
    """Base exception for Astrospheric API errors."""


class AstrosphericAuthError(AstrosphericApiError):
    """Raised when the API key is invalid or unauthorized."""


class AstrosphericLocationError(AstrosphericApiError):
    """Raised when the location is outside the RDPS model domain."""


class AstrosphericApiClient:
    """Async client for the Astrospheric Data API."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        api_key: str,
        latitude: float,
        longitude: float,
    ) -> None:
        """Initialize the API client."""
        self._session = session
        self._api_key = api_key
        self._latitude = latitude
        self._longitude = longitude

    async def get_forecast(self) -> dict[str, Any]:
        """Fetch 81-hour forecast data (5 credits).

        Returns the full JSON response dict.
        Raises AstrosphericApiError on failure.
        """
        payload = {
            "Latitude": self._latitude,
            "Longitude": self._longitude,
            "APIKey": self._api_key,
        }
        return await self._request(ENDPOINT_FORECAST, payload)

    async def get_sky(self, timestamp_ms: int) -> dict[str, Any]:
        """Fetch current sky object positions (1 credit).

        Args:
            timestamp_ms: Milliseconds since Unix epoch (UTC).

        Returns the full JSON response dict.
        Raises AstrosphericApiError on failure.
        """
        payload = {
            "Latitude": self._latitude,
            "Longitude": self._longitude,
            "MSSinceEpoch": timestamp_ms,
            "APIKey": self._api_key,
        }
        return await self._request(ENDPOINT_SKY, payload)

    async def validate_credentials(self) -> bool:
        """Make a test forecast call to validate the API key and location.

        Returns True if valid. Raises specific exceptions on known failures.
        """
        try:
            await self.get_forecast()
        except AstrosphericAuthError:
            raise
        except AstrosphericLocationError:
            raise
        except AstrosphericApiError:
            raise
        return True

    async def _request(
        self, endpoint: str, payload: dict[str, Any]
    ) -> dict[str, Any]:
        """Send a POST request to the Astrospheric API.

        Handles HTTP status codes and maps them to typed exceptions.
        """
        try:
            async with asyncio.timeout(15):
                async with self._session.post(
                    endpoint, json=payload
                ) as resp:
                    if resp.status == 200:
                        return await resp.json()

                    body = await resp.text()

                    if resp.status == 403:
                        raise AstrosphericAuthError(
                            f"Invalid API key or unauthorized: {body}"
                        )

                    if resp.status == 400:
                        # 400 can mean bad input or location outside RDPS domain
                        if "domain" in body.lower() or "location" in body.lower() or "latitude" in body.lower():
                            raise AstrosphericLocationError(
                                f"Location outside RDPS model domain: {body}"
                            )
                        raise AstrosphericApiError(
                            f"Bad request: {body}"
                        )

                    raise AstrosphericApiError(
                        f"API error (HTTP {resp.status}): {body}"
                    )

        except asyncio.TimeoutError as err:
            raise AstrosphericApiError("API request timed out") from err
        except aiohttp.ClientError as err:
            raise AstrosphericApiError(
                f"Connection error: {err}"
            ) from err
