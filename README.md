# BOXLANG Icon Font

A custom icon-font pipeline powered by Fantasticon.

This project generates:
- font files
- CSS token variables for icon unicodes
- icon utility classes
- a searchable demo page

## What Gets Generated

After running the build, the `dist` folder contains:
- `ic-icons.woff2`, `ic-icons.woff`, `ic-icons.ttf`, `ic-icons.svg`
- `icons-tokens.css` (single source of truth for unicode values)
- `icons.css` (stable class API)
- `icons.manifest.json` (icon metadata used by demo)
- `index.html` (demo page)

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

Build pipeline:
1. reads icon names from `src/icons`
2. syncs/extends `icon-unicode-map.json`
3. generates `dist/icons-tokens.css` and `dist/icons.manifest.json`
4. generates `icons.css` and copies it to `dist/icons.css`
5. compiles the font files with Fantasticon
6. writes demo as `dist/index.html`

## Deploy Demo

```bash
npm run deploy
```

This publishes `dist` using `gh-pages`.

## How To Use In a Project

Include both CSS files:

```html
<link rel="stylesheet" href="icons-tokens.css" />
<link rel="stylesheet" href="icons.css" />
```

Use icon classes directly (current prefix is `icon-`):

```html
<i class="icon-document"></i>
<i class="icon-chevron-up"></i>
<i class="icon-github"></i>
```

Use in pseudo-elements:

```css
.button-download::before {
  font-family: "ic-icons";
  content: var(--icon-download);
}
```

## Class and Token Naming

- Icon classes are generated as `icon-{normalized-name}`.
- Token variables are generated as `--icon-{normalized-name}`.
- Names come from SVG filenames in `src/icons` and are normalized to lowercase kebab-case.

Example:
- file name: `UI-form.svg`
- class: `icon-ui-form`
- token: `--icon-ui-form`

## Add New Icons

1. Drop a new `.svg` file into `src/icons`.
2. Run:

```bash
npm run build
```

The build will:
- assign a unicode to new icons in `icon-unicode-map.json`
- generate the matching class in `icons.css`
- include it in `dist/icons.manifest.json` and demo page

## Total Icon Count

Two reliable references:
- demo page header shows total loaded icons from `icons.manifest.json`
- `dist/icons.manifest.json` length equals the generated icon count

Quick CLI check:

```bash
find src/icons -maxdepth 1 -type f -name '*.svg' | wc -l
```

## Project Structure

```text
src/icons/                 # source SVG icons
templates/preview.hbs      # demo template
icon-unicode-map.json      # persisted unicode map
generate-unicodes.js       # map + tokens + manifest generator
generate-icon-classes.js   # class CSS generator
fantasticon.config.json    # base Fantasticon config
fantasticon.config.js      # runtime config (injects numeric codepoints)
```

## Troubleshooting

### Wrong icon appears for a class

1. Rebuild:

```bash
npm run build
```

2. Hard refresh browser (Cmd+Shift+R).
3. Clear cached font files if needed.

### New icon does not appear

- confirm SVG is in `src/icons`
- confirm filename normalizes uniquely (no collisions)
- run build again and check `dist/icons.manifest.json`

## Notes

- Do not manually edit generated files inside `dist`.
- Do not manually edit unicode values in CSS output. The source of truth is the generated token file (`dist/icons-tokens.css`) plus `icon-unicode-map.json` for persisted assignments.
