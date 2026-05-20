const fs = require("fs");
const path = require("path");

const MAP_PATH = path.resolve("./icon-unicode-map.json");
const OUTPUT_PATH = path.resolve("./icons.css");
const ICONS_DIR = path.resolve("./src/icons");

function normalizeIconName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const unicodeMap = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
const iconNames = fs
  .readdirSync(ICONS_DIR)
  .filter(file => file.endsWith(".svg"))
  .map(file => path.basename(file, ".svg"))
  .sort((a, b) => a.localeCompare(b));

const normalizedMap = new Map();
const normalizedNames = [];

iconNames.forEach(name => {
  const normalized = normalizeIconName(name);
  const existing = normalizedMap.get(normalized);

  if (existing && existing !== name) {
    throw new Error(
      `Icon name collision after normalization: "${existing}" and "${name}" both map to "${normalized}"`
    );
  }

  normalizedMap.set(normalized, name);
  normalizedNames.push(normalized);

  if (!unicodeMap[name]) {
    throw new Error(
      `Missing unicode for icon "${name}". Run "node generate-unicodes.js" first.`
    );
  }
});

const lines = [
  "/* Stable icon API. Update this file only when icon names change. */",
  "@font-face {",
  "  font-family: \"ic-icons\";",
  "  src:",
  "    url(\"./ic-icons.woff2\") format(\"woff2\"),",
  "    url(\"./ic-icons.woff\") format(\"woff\"),",
  "    url(\"./ic-icons.ttf\") format(\"truetype\"),",
  "    url(\"./ic-icons.svg#ic-icons\") format(\"svg\");",
  "  font-display: block;",
  "}",
  "",
  [
    ".icon::before",
    ...normalizedNames.map(name => `.icon-${name}::before`)
  ].join(",\n") + " {",
  "  font-family: \"ic-icons\";",
  "  display: inline-block;",
  "  font-style: normal;",
  "  font-weight: normal;",
  "  line-height: 1;",
  "  text-transform: none;",
  "  -webkit-font-smoothing: antialiased;",
  "  -moz-osx-font-smoothing: grayscale;",
  "}",
  "",
  "/* Reusable icon classes mapped to token variables. */",
  ...normalizedNames.flatMap(name => [
    `.icon-${name}::before {`,
    `  content: var(--icon-${name});`,
    "}"
  ]),
  "",
  "/* Example pseudo-element usage */",
  ".dropdown-toggle::after {",
  "  font-family: \"ic-icons\";",
  "  content: var(--icon-chevron-down);",
  "}",
  ""
];

fs.writeFileSync(OUTPUT_PATH, lines.join("\n"));

console.log(`✔ Wrote ${OUTPUT_PATH} with ${normalizedNames.length} icon classes`);
