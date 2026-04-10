# Astrospheric Lovelace Cards

This package contains custom Lovelace cards for the Astrospheric Home Assistant integration.

## Included files
- `package.json`
- `rollup.config.js`
- `hacs.json`
- `src/index.ts`
- `src/types.ts`
- `src/cards/astrospheric-conditions-card.ts`
- `src/cards/astrospheric-moon-card.ts`
- `src/cards/astrospheric-sky-map-card.ts`
- `src/cards/astrospheric-forecast-card.ts`
- `src/cards/astrospheric-tonight-card.ts`
- `src/utils/theme.ts`
- `src/utils/color-scales.ts`
- `src/utils/astronomy-math.ts`
- `src/utils/moon-svg.ts`

## Build

```bash
cd lovelace-astrospheric-cards
npm install
npm run build
```

The build output will be written to `dist/astrospheric-cards.js`.

## Install

### Manual
1. Copy `dist/astrospheric-cards.js` into your Home Assistant `config/www/` folder.
2. Add a resource in Home Assistant:
   - URL: `/local/astrospheric-cards.js`
   - Type: `JavaScript Module`

### HACS
1. Add this repository as a custom repository in HACS, category `Frontend`.
2. Install `Astrospheric Cards`.
3. Add the HACS resource if not added automatically:
   - URL: `/hacsfiles/lovelace-astrospheric-cards/astrospheric-cards.js`
   - Type: `JavaScript Module`
