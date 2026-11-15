/* Minium builder: pure functions that assemble a custom build from the source CSS.
   Used by docs/builder.js in the browser. Has no DOM access, so it also runs in Node. */

/* Same order as scripts/build-css.mjs. Update both when adding a CSS file. */
export const BUNDLE_ORDER = [
  "theme.css", "roles.css", "reset.css", "base.css", "typography.css", "layout.css",
  "button.css", "component-accordion.css", "component-alert.css", "component-avatar.css",
  "component-badge.css", "component-card.css", "component-dropdown.css", "component-icon.css",
  "component-loading.css", "component-menu.css", "component-modal.css", "component-skeleton.css",
  "component-tooltip.css", "form-checkbox-radio-switch.css", "form.css", "nav.css", "progress.css",
  "utilities.css",
];

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
  { id: "skeleton", label: "Skeleton", files: ["component-skeleton.css"] },
  { id: "tooltip", label: "Tooltip", files: ["component-tooltip.css"] },
  { id: "utilities", label: "Utilities", files: ["utilities.css"] },
];

export const ROLES = ["neutral", "primary", "accent", "success", "danger", "warning", "info"];

export const RADIUS = { none: 0, small: 0.5, medium: 1, large: 1.5 };

const SYSTEM_FONT = "system-ui, 'Segoe UI', 'Noto Sans', roboto, helvetica, arial, sans-serif, 'Apple Color Emoji','Segoe UI Emoji'";
const SYSTEM_FONT_MONO = "ui-monospace, sfmono-regular, consolas, 'Liberation Mono', menlo, monospace";

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
  return BUNDLE_ORDER.filter((file) => wanted.has(file));
}

/* Color roles
   roles.css and css/themes/*.css hold role groups such as "/* primary: blue *\/" in an sRGB block
   and again in a P3 block. Every non-neutral group has the same steps and only refers to its own
   role and to neutral, so a scale can move to another role by renaming "--primary-" to "--accent-". */

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
  const library = { neutral: {}, color: {}, grayPrimary: null, grayScales: themesConfig.grayScales };

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
    if (!entry?.srgb || !entry?.p3) throw new Error(`No ${role} scale named "${scale}"`);

    for (const block of ["srgb", "p3"]) {
      const lines = entry[block].map((line) => line.replaceAll("--ROLE-", `--${role}-`));
      blocks[block].push(`/* ${role}: ${scale} */`, ...lines, "");
    }
  }

  const indent = (lines, spaces) => lines.map((line) => (line ? " ".repeat(spaces) + line : "")).join("\n").trimEnd();

  return `@layer tokens {
  :root {
${indent(blocks.srgb, 4)}
  }

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

function scaleLength(value, factor) {
  const match = value.match(/^(-?[\d.]+)(rem|px|em)$/);
  if (!match) throw new Error(`Cannot scale ${value}`);
  return `${+(Number(match[1]) * factor).toFixed(4)}${match[2]}`;
}

/* options: { radius, fonts: "default" | "system", scale, contentWidth, borderWidth, fontBaseUrl } */
export function applyTokens(themeCss, options) {
  let css = themeCss;

  const radius = RADIUS[options.radius] ?? 1;
  if (radius !== 1) {
    for (const size of ["s", "m", "l"]) {
      css = replaceToken(css, `--border-radius-${size}`, (value) => scaleLength(value, radius));
    }
  }

  if (options.fonts === "system") {
    css = css.replace(/@font-face\s*{[^}]*}\s*/g, "");
    css = replaceToken(css, "--font", () => SYSTEM_FONT);
    css = replaceToken(css, "--font-mono", () => SYSTEM_FONT_MONO);
  } else if (options.fontBaseUrl) {
    css = css.replace(/url\("fonts\//g, `url("${options.fontBaseUrl}`);
  }

  if (options.scale && options.scale !== 1) {
    css = css.replace(/(--(?:size|space)-[a-z0-9-]+\s*:\s*)([^;]+);/g,
      (_, prefix, value) => `${prefix}calc(${value.trim()} * ${options.scale});`);
  }

  if (options.contentWidth) css = replaceToken(css, "--content-width", () => `${options.contentWidth}ch`);
  if (options.borderWidth) css = replaceToken(css, "--border-width", () => `${options.borderWidth}px`);

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
