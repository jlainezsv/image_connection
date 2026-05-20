const fs = require("fs");
const path = require("path");

// --------------------------------------------
// Load Fantasticon config
// --------------------------------------------
const config = JSON.parse(
  fs.readFileSync("./fantasticon.config.json", "utf8")
);

// --------------------------------------------
// Constants
// --------------------------------------------
const ICONS_DIR = path.resolve(config.inputDir);
const OUTPUT_DIR = path.resolve(config.outputDir);
const UNICODE_MAP_PATH = path.resolve("./icon-unicode-map.json");
const START_UNICODE = 0xf100;

function normalizeIconName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --------------------------------------------
// Load or init unicode map (SAFE)
// --------------------------------------------
let unicodeMap = {};
if (fs.existsSync(UNICODE_MAP_PATH)) {
  const raw = fs.readFileSync(UNICODE_MAP_PATH, "utf8").trim();
  unicodeMap = raw ? JSON.parse(raw) : {};
}

// --------------------------------------------
// Read SVG icon names (SOURCE OF TRUTH)
// --------------------------------------------
const iconNames = fs
  .readdirSync(ICONS_DIR)
  .filter(f => f.endsWith(".svg"))
  .map(f => path.basename(f, ".svg"))
  .sort((a, b) => a.localeCompare(b));

const normalizedNameMap = new Map();
iconNames.forEach(name => {
  const normalized = normalizeIconName(name);
  const existing = normalizedNameMap.get(normalized);

  if (existing && existing !== name) {
    throw new Error(
      `Icon name collision after normalization: "${existing}" and "${name}" both map to "${normalized}"`
    );
  }

  normalizedNameMap.set(normalized, name);
});

// --------------------------------------------
// PRUNE unicode map (remove non-existing SVGs)
// --------------------------------------------
// const validIcons = new Set(iconNames);
// Object.keys(unicodeMap).forEach(name => {
//   if (!validIcons.has(name)) {
//     delete unicodeMap[name];
//   }
// });

// --------------------------------------------
// Find last used unicode
// --------------------------------------------
const usedCodes = Object.values(unicodeMap).map(c =>
  parseInt(c, 16)
);

let lastCode = usedCodes.length
  ? Math.max(...usedCodes)
  : START_UNICODE;

// --------------------------------------------
// Assign unicode ONLY to new icons
// --------------------------------------------
iconNames.forEach(name => {
  if (!unicodeMap[name]) {
    lastCode++;
    unicodeMap[name] = lastCode.toString(16);
  }
});

// --------------------------------------------
// Persist unicode map
// --------------------------------------------
fs.writeFileSync(
  UNICODE_MAP_PATH,
  JSON.stringify(unicodeMap, null, 2)
);

// --------------------------------------------
// Generate manifest for demo (ONLY real icons)
// --------------------------------------------
const manifest = iconNames.map(name => ({
  name,
  class: `icon-${normalizeIconName(name)}`,
  unicode: unicodeMap[name]
}));

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

fs.writeFileSync(
  path.join(OUTPUT_DIR, "icons.manifest.json"),
  JSON.stringify(manifest, null, 2)
);

const tokensCss = [
  "/* Auto-generated file. Do not edit manually. */",
  ":root {",
  ...iconNames.map(name => {
    const tokenName = normalizeIconName(name);
    return `  --icon-${tokenName}: "\\${unicodeMap[name]}";`;
  }),
  "}",
  ""
].join("\n");

fs.writeFileSync(path.join(OUTPUT_DIR, "icons-tokens.css"), tokensCss);

console.log("✔ Unicode map, icon manifest and CSS tokens generated");
