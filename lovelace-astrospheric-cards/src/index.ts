/**
 * Astrospheric Lovelace Cards — Entry Point
 *
 * Registers all custom cards with Home Assistant.
 */

import "./cards/astrospheric-conditions-card.js";
import "./cards/astrospheric-moon-card.js";
import "./cards/astrospheric-sky-map-card.js";
import "./cards/astrospheric-forecast-card.js";
import "./cards/astrospheric-tonight-card.js";

// Register cards in the HA custom card picker
const CARDS = [
  {
    type: "astrospheric-conditions-card",
    name: "Astrospheric Conditions",
    description: "Sky conditions gauges for seeing, transparency, and cloud cover",
  },
  {
    type: "astrospheric-moon-card",
    name: "Astrospheric Moon Phase",
    description: "Moon phase visualization with illumination and position",
  },
  {
    type: "astrospheric-sky-map-card",
    name: "Astrospheric Sky Map",
    description: "Polar sky map showing sun, moon, planets, and stars",
  },
  {
    type: "astrospheric-forecast-card",
    name: "Astrospheric Forecast",
    description: "81-hour forecast timeline with conditions overlay",
  },
  {
    type: "astrospheric-tonight-card",
    name: "Astrospheric Tonight",
    description: "Go/No-Go observing summary for tonight",
  },
];

// Make cards discoverable in HA card picker
(window as any).customCards = (window as any).customCards || [];
for (const card of CARDS) {
  (window as any).customCards.push(card);
}

console.info(
  "%c ASTROSPHERIC CARDS %c v1.0.0 ",
  "color: white; background: #0B1026; font-weight: bold;",
  "color: #0B1026; background: #FFD54F; font-weight: bold;"
);
