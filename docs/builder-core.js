/* Minium customizer: pure functions that assemble a custom build from the source CSS.
   Used by docs/builder.js (the UI of docs/customizer.html) in the browser. Has no DOM access, so it also runs in Node. */

/* Same order as scripts/build-css.mjs. Update both when adding a CSS file. */
export const BUNDLE_ORDER = [
  "theme.css", "roles.css", "reset.css", "base.css", "typography.css", "layout.css",
  "button.css", "component-accordion.css", "component-alert.css", "component-avatar.css",
  "component-badge.css", "component-card.css", "component-dropdown.css", "component-icon.css",
  "component-loading.css", "component-menu.css", "component-modal.css", "component-segmented.css",
  "component-skeleton.css",
  "component-tooltip.css", "form-checkbox-radio-switch.css", "form.css", "nav.css", "progress.css",
  "utilities.css",
];

/* Integrations ship separately in dist/integrations/; in a custom build they come last */
export const INTEGRATION_FILES = ["integrations/django.css", "integrations/prism.css"];

export const ALL_FILES = [...BUNDLE_ORDER, ...INTEGRATION_FILES];

export const CORE_FILES = [
  "theme.css", "roles.css", "reset.css", "base.css", "typography.css", "layout.css",
  "button.css", "form.css", "form-checkbox-radio-switch.css",
];

/* Optional modules. `files` lists every file a module needs, including shared ones. */
export const MODULES = [
  { id: "accordion", label: "Accordion", files: ["component-accordion.css"] },
  { id: "alert", label: "Alert", files: ["component-alert.css"] },
  { id: "avatar", label: "Avatar", files: ["component-avatar.css"] },
  { id: "badge", label: "Badge", files: ["component-badge.css"] },
  { id: "card", label: "Card", files: ["component-card.css"] },
  { id: "dropdown", label: "Dropdown", files: ["component-dropdown.css", "component-menu.css"] },
  { id: "icon", label: "Icon", files: ["component-icon.css"] },
  { id: "loading", label: "Loading", files: ["component-loading.css"] },
  { id: "modal", label: "Modal", files: ["component-modal.css"] },
  { id: "nav", label: "Navigation (navbar, side menu, tabs, pagination, breadcrumb)", files: ["nav.css", "component-menu.css"] },
  { id: "progress", label: "Progress and meter", files: ["progress.css"] },
  { id: "segmented", label: "Segmented control", files: ["component-segmented.css"] },
  { id: "skeleton", label: "Skeleton", files: ["component-skeleton.css"] },
  { id: "tooltip", label: "Tooltip", files: ["component-tooltip.css"] },
  { id: "utilities", label: "Utilities", files: ["utilities.css"] },
  { id: "django", label: "Django forms", group: "integrations", files: ["integrations/django.css"] },
  { id: "prism", label: "Prism.js syntax highlighting", group: "integrations", files: ["integrations/prism.css"] },
];

export const ROLES = ["neutral", "primary", "accent", "success", "danger", "warning", "info"];

export const RADIUS = { none: 0, small: 0.5, medium: 1, large: 1.5 };

/* Density sets line height and multiplies the flow spacing. Glue spacing stays fixed so that
   related items, such as a label and its help text, stay together. */
export const DENSITY = { compact: { lineHeight: 1.35, flow: 0.75 }, airy: { lineHeight: 1.65, flow: 1.25 } };

const SYSTEM_FONT = "system-ui, 'Segoe UI', 'Noto Sans', roboto, helvetica, arial, sans-serif, 'Apple Color Emoji','Segoe UI Emoji'";
const SYSTEM_FONT_MONO = "ui-monospace, sfmono-regular, consolas, 'Liberation Mono', menlo, monospace";
const SYSTEM_FONT_SERIF = "ui-serif, georgia, cambria, 'Times New Roman', times, serif";

/* Fonts from Fontsource, served by jsDelivr. Each URL pins the version, and every font has
   400 and 700 weights in the latin and latin-ext subsets. "use" sets where the builder offers the font:
   body fonts are also offered for headings, and only body fonts load italics. */
const FONTSOURCE_URL = "https://cdn.jsdelivr.net/fontsource/fonts/";
const UNICODE_RANGES = {
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  "latin-ext": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
};
const FALLBACKS = { sans: SYSTEM_FONT, serif: SYSTEM_FONT_SERIF, mono: SYSTEM_FONT_MONO };

export const FONTS = [
  { id: "dm-sans", family: "DM Sans", version: "5.3.0", use: "body", category: "sans" },
  { id: "geist", family: "Geist", version: "5.3.0", use: "body", category: "sans" },
  { id: "ibm-plex-sans", family: "IBM Plex Sans", version: "5.3.0", use: "body", category: "sans" },
  { id: "inter", family: "Inter", version: "5.3.0", use: "body", category: "sans" },
  { id: "merriweather", family: "Merriweather", version: "5.3.0", use: "body", category: "serif" },
  { id: "montserrat", family: "Montserrat", version: "5.3.0", use: "body", category: "sans" },
  { id: "open-sans", family: "Open Sans", version: "5.3.0", use: "body", category: "sans" },
  { id: "poppins", family: "Poppins", version: "5.3.0", use: "body", category: "sans" },
  { id: "pt-sans", family: "PT Sans", version: "5.3.0", use: "body", category: "sans" },
  { id: "roboto", family: "Roboto", version: "5.3.0", use: "body", category: "sans" },
  { id: "bricolage-grotesque", family: "Bricolage Grotesque", version: "5.3.0", use: "heading", category: "sans" },
  { id: "fraunces", family: "Fraunces", version: "5.3.0", use: "heading", category: "serif" },
  { id: "outfit", family: "Outfit", version: "5.3.0", use: "heading", category: "sans" },
  { id: "playfair-display", family: "Playfair Display", version: "5.3.0", use: "heading", category: "serif" },
  { id: "space-grotesk", family: "Space Grotesk", version: "5.3.0", use: "heading", category: "sans" },
  { id: "fira-code", family: "Fira Code", version: "5.3.0", use: "mono", category: "mono" },
  { id: "geist-mono", family: "Geist Mono", version: "5.3.0", use: "mono", category: "mono" },
  { id: "ibm-plex-mono", family: "IBM Plex Mono", version: "5.3.0", use: "mono", category: "mono" },
  { id: "inconsolata", family: "Inconsolata", version: "5.3.0", use: "mono", category: "mono" },
  { id: "jetbrains-mono", family: "JetBrains Mono", version: "5.3.0", use: "mono", category: "mono" },
];

/* The fonts bundled with Minium, which theme.css already loads */
const BUNDLED = { font: "pt-sans", mono: "inconsolata" };

function fontStack(font) {
  return `"${font.family}", ${FALLBACKS[font.category]}`;
}

function fontFaces(font, variants) {
  return variants.flatMap(([weight, style]) => Object.entries(UNICODE_RANGES).map(([subset, range]) => `@font-face {
  font-family: "${font.family}";
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url("${FONTSOURCE_URL}${font.id}@${font.version}/${subset}-${weight}-${style}.woff2") format("woff2");
  unicode-range: ${range};
}`)).join("\n");
}

const BODY_VARIANTS = [[400, "normal"], [400, "italic"], [700, "normal"], [700, "italic"]];
const MONO_VARIANTS = [[400, "normal"], [700, "normal"]];
const HEADING_VARIANTS = [[700, "normal"]];

/* Same as scripts/build-css.mjs */
export function removeComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

export function minifyCss(css) {
  return css
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .replace(/:\s+/g, ":")
    .replace(/;}/g, "}")
    .trim();
}

export function filesFor(moduleIds) {
  const wanted = new Set(CORE_FILES);
  for (const module of MODULES) {
    if (moduleIds.includes(module.id)) module.files.forEach((file) => wanted.add(file));
  }
  return ALL_FILES.filter((file) => wanted.has(file));
}

/* Light-mode color of a scale step, for swatches. Neutral scales have no step 9, so they fall back to 8. */
export function swatchColor(library, scale, step = "9") {
  const entry = library.color[scale] ?? library.neutral[scale];
  const line = entry?.srgb.find((value) => value.startsWith(`--ROLE-${step}:`) || value.startsWith(`--neutral-${step}:`))
    ?? entry?.srgb.find((value) => value.startsWith("--neutral-8:"));
  return line?.match(/light-dark\((#[0-9a-f]{6,8})/i)?.[1] ?? "transparent";
}

/* Color roles
   roles.css and css/themes/*.css hold role groups such as "/* primary: blue *\/" in an sRGB block
   and again in a P3 block. Gray scales have no P3 values. Every non-neutral group has the same steps
   and only refers to its own role and to neutral, so a scale can move to another role by renaming "--primary-" to "--accent-". */

/* Returns role groups ({ block, role, scale, lines }) and token groups ({ block, title, lines }),
   such as "/* gray primary *\/" that the generator adds after the roles. */
export function parseGroups(css) {
  const groups = [];
  let block = "srgb";
  let current = null;

  for (const line of css.split("\n")) {
    if (line.includes("@supports")) block = "p3";
    const heading = line.match(/^\s*\/\*\s*([a-z ]+?)(?::\s*([a-z]+))?\s*\*\/\s*$/);
    if (heading) {
      current = ROLES.includes(heading[1]) && heading[2]
        ? { block, role: heading[1], scale: heading[2], lines: [] }
        : { block, title: heading[1], lines: [] };
      groups.push(current);
    } else if (current && /^\s*--[a-z0-9-]+\s*:/.test(line)) {
      current.lines.push(line.trim());
    } else if (/^\s*}/.test(line)) {
      current = null;
    }
  }

  return groups;
}

export function parseRoleGroups(css) {
  return parseGroups(css).filter((group) => group.role);
}

/* Collects every scale from the given role files into { neutral: {scale: {srgb, p3}}, color: {...} }.
   Color lines use the placeholder "--ROLE-". Also keeps the "gray primary" token overrides and the
   gray scale list from scripts/themes.json. */
export function buildScaleLibrary(cssFiles, themesConfig) {
  const library = { neutral: {}, color: {}, grayPrimary: null, grayScales: themesConfig.grayScales,
    brightScales: themesConfig.brightScales };

  for (const css of cssFiles) {
    for (const group of parseGroups(css)) {
      if (group.title === "gray primary") library.grayPrimary ??= group.lines;
      if (!group.role) continue;
      const kind = group.role === "neutral" ? "neutral" : "color";
      const lines = kind === "neutral"
        ? group.lines
        : group.lines.map((line) => line.replaceAll(`--${group.role}-`, "--ROLE-"));
      const entry = (library[kind][group.scale] ??= {});
      entry[group.block] ??= lines;
    }
  }

  return library;
}

/* Icons with the role's step 9 baked into the SVG stroke (same as bakedIcons in scripts/build-themes.mjs) */
const BAKED_ICONS = { success: "--icon-valid", danger: "--icon-invalid" };

/* Applies the color rules that live in theme.css: gray primary overrides and baked icon colors */
export function applyColorTokens(themeCss, mapping, library) {
  let css = themeCss;

  if (library.grayScales.includes(mapping.primary)) {
    if (!library.grayPrimary) throw new Error("No gray primary overrides found");
    for (const line of library.grayPrimary) {
      const [, name, value] = line.match(/^(--[a-z0-9-]+)\s*:\s*(.+);$/);
      css = replaceToken(css, name, () => value);
    }
  }

  for (const [role, token] of Object.entries(BAKED_ICONS)) {
    const step9 = library.color[mapping[role]].srgb.find((line) => line.startsWith("--ROLE-9:"));
    const color = step9.match(/light-dark\(#([0-9a-f]{6})/i)[1];
    css = replaceToken(css, token, (value) => value.replace(/stroke='%23[0-9a-f]{6}'/i, `stroke='%23${color}'`));
  }

  return css;
}

/* Theme presets from scripts/themes.json. The theme name is its primary scale. */
export function themeMapping(themesConfig, name) {
  const theme = themesConfig.themes[name];
  return { neutral: theme.neutral, primary: name, accent: theme.accent, success: theme.success,
    danger: theme.danger, warning: theme.warning, info: theme.info };
}

export function renderRoles(mapping, library) {
  const blocks = { srgb: [], p3: [] };

  for (const role of ROLES) {
    const scale = mapping[role];
    const entry = role === "neutral" ? library.neutral[scale] : library.color[scale];
    const gray = library.grayScales.includes(scale);
    if (!entry?.srgb || (!entry.p3 && !gray)) throw new Error(`No ${role} scale named "${scale}"`);

    // Gray scales have no P3 values, like in scripts/build-themes.mjs
    for (const block of gray ? ["srgb"] : ["srgb", "p3"]) {
      const lines = entry[block].map((line) => line.replaceAll("--ROLE-", `--${role}-`));
      blocks[block].push(`/* ${role}: ${scale} */`, ...lines, "");
    }
  }

  const indent = (lines, spaces) => lines.map((line) => (line ? " ".repeat(spaces) + line : "")).join("\n").trimEnd();

  const srgb = `  :root {
${indent(blocks.srgb, 4)}
  }
`;
  if (blocks.p3.length === 0) return `@layer tokens {\n${srgb}}\n`;

  return `@layer tokens {
${srgb}
  @supports (color: color(display-p3 1 1 1)) {
    @media (color-gamut: p3) {
      :root {
${indent(blocks.p3, 8)}
      }
    }
  }
}
`;
}

/* Tokens in theme.css. Each token is declared once, so values are replaced by name. */

function replaceToken(css, name, transform) {
  const pattern = new RegExp(`(${name}\\s*:\\s*)([^;]+);`);
  if (!pattern.test(css)) throw new Error(`Token ${name} not found`);
  return css.replace(pattern, (_, prefix, value) => `${prefix}${transform(value.trim())};`);
}

/* Removes the @font-face rules of one bundled font family */
function removeFontFaces(css, family) {
  return css.replace(/@font-face\s*{[^}]*}\s*/g,
    (rule) => (rule.match(/font-family:\s*"?([^";]+)"?;/)?.[1] === family ? "" : rule));
}

function scaleLength(value, factor) {
  const match = value.match(/^(-?[\d.]+)(rem|px|em)$/);
  if (!match) throw new Error(`Cannot scale ${value}`);
  return `${+(Number(match[1]) * factor).toFixed(4)}${match[2]}`;
}

/* options: { radius, font: "default" | "system" | font id, headingFont: "body" | "serif" | "mono" | font id,
   monoFont: "default" | "system" | font id, density: "compact" | "airy", scale, contentWidth, borderWidth, underlineThickness, fontBaseUrl } */
export function applyTokens(themeCss, options) {
  let css = themeCss;

  const radius = RADIUS[options.radius] ?? 1;
  if (radius !== 1) {
    for (const size of ["s", "m", "l"]) {
      css = replaceToken(css, `--border-radius-${size}`, (value) => scaleLength(value, radius));
    }
  }

  /* Fonts: "default" keeps the bundled font, "system" uses system fonts, anything else is a font id */
  const findFont = (id) => FONTS.find((font) => font.id === id);
  const bodyId = options.font === "default" || !options.font ? BUNDLED.font : options.font;
  const monoId = options.monoFont === "default" || !options.monoFont ? BUNDLED.mono : options.monoFont;
  const faces = [];

  if (bodyId !== BUNDLED.font) {
    css = removeFontFaces(css, "PT Sans");
    const font = findFont(bodyId);
    if (font) faces.push(fontFaces(font, BODY_VARIANTS));
    css = replaceToken(css, "--font", () => (font ? fontStack(font) : SYSTEM_FONT));
  }

  if (monoId !== BUNDLED.mono) {
    css = removeFontFaces(css, "Inconsolata");
    const font = findFont(monoId);
    if (font) faces.push(fontFaces(font, MONO_VARIANTS));
    css = replaceToken(css, "--font-mono", () => (font ? fontStack(font) : SYSTEM_FONT_MONO));
  }

  /* Headings: "body" keeps the library default (--font-heading: var(--font)) */
  const heading = options.headingFont ?? "body";
  if (heading === "serif") css = replaceToken(css, "--font-heading", () => SYSTEM_FONT_SERIF);
  else if (heading === "mono") css = replaceToken(css, "--font-heading", () => "var(--font-mono)");
  else if (heading !== "body" && heading !== bodyId) {
    const font = findFont(heading);
    if (!font) throw new Error(`No font named "${heading}"`);
    faces.push(fontFaces(font, HEADING_VARIANTS));
    css = replaceToken(css, "--font-heading", () => fontStack(font));
  }

  if (options.fontBaseUrl) css = css.replace(/url\("fonts\//g, `url("${options.fontBaseUrl}`);
  if (faces.length) css = css.replace("@layer tokens {", `${faces.join("\n")}\n\n@layer tokens {`);

  const density = DENSITY[options.density];
  if (density) {
    css = replaceToken(css, "--line-height", () => String(density.lineHeight));
    for (const token of ["--flow-space-tight", "--flow-space", "--flow-space-loose"]) {
      css = replaceToken(css, token, (value) => scaleLength(value, density.flow));
    }
  }

  if (options.scale && options.scale !== 1) {
    css = css.replace(/(--(?:size|space)-[a-z0-9-]+\s*:\s*)([^;]+);/g,
      (_, prefix, value) => `${prefix}calc(${value.trim()} * ${options.scale});`);
  }

  if (options.contentWidth) css = replaceToken(css, "--content-width", () => `${options.contentWidth}ch`);
  if (options.borderWidth) css = replaceToken(css, "--border-width", () => `${options.borderWidth}px`);
  if (options.underlineThickness) {
    css = replaceToken(css, "--text-decoration-thickness", () => `${options.underlineThickness}px`);
  }

  return css;
}

/* sources: Map of file name to source text (roles.css is replaced by the rendered roles).
   Returns { css, minified } where both start with a header comment. */
export function buildCss({ sources, moduleIds, mapping, library, tokens, header }) {
  const parts = filesFor(moduleIds).map((file) => {
    if (file === "roles.css") return renderRoles(mapping, library);
    if (file === "theme.css") return applyTokens(applyColorTokens(sources.get(file), mapping, library), tokens);
    return sources.get(file);
  });

  const readable = parts.map((part) => `\n${removeComments(part).trim()}\n`).join("\n").trim() + "\n";
  const banner = `/*! ${header} */\n`;

  return { css: banner + readable, minified: banner + minifyCss(readable) + "\n" };
}
