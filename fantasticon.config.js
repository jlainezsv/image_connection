const baseConfig = require("./fantasticon.config.json");
const rawCodepoints = require("./icon-unicode-map.json");

function toNumericCodepoint(value, iconName) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid codepoint for ${iconName}: expected string or number.`);
  }

  // Stored as hex strings like "f13f" in icon-unicode-map.json.
  const cleaned = value.replace(/^\\u|^0x/i, "");
  const parsed = Number.parseInt(cleaned, 16);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid hex codepoint for ${iconName}: ${value}`);
  }

  return parsed;
}

const codepoints = Object.fromEntries(
  Object.entries(rawCodepoints).map(([iconName, codepoint]) => [
    iconName,
    toNumericCodepoint(codepoint, iconName)
  ])
);

module.exports = {
  ...baseConfig,
  // Fantasticon expects an object here; passing a JSON path can desync glyph mapping.
  codepoints
};
