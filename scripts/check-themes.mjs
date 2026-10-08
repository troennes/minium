// Checks css/roles.css and css/themes/*.css: up to date with the generator, and structurally valid.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  bakedIcons,
  colorRoles,
  colorSteps,
  generateThemes,
  layerOrder,
  neutralSteps,
  rolesPath,
  themesDir
} from './build-themes.mjs';

const errors = [];
const expected = generateThemes();

// Up to date: every generated file exists with the same content, and nothing else is in css/themes/
for (const [path, content] of expected) {
  if (!existsSync(path)) {
    errors.push(`${path}: missing`);
  } else if (readFileSync(path, 'utf8') !== content) {
    errors.push(`${path}: differs from generator output`);
  }
}

const themeFiles = existsSync(themesDir)
  ? readdirSync(themesDir).filter((file) => file.endsWith('.css')).map((file) => join(themesDir, file))
  : [];

for (const path of themeFiles) {
  if (!expected.has(path)) {
    errors.push(`${path}: not in scripts/themes.json`);
  }
}

// Structure: layer order first, complete roles, icons for changed success/danger
function definedTokens(css) {
  return new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
}

function checkRoles(path, css, requireAll) {
  const p3Index = css.indexOf('@supports (color: color(display-p3');
  const srgb = definedTokens(p3Index === -1 ? css : css.slice(0, p3Index));
  const p3 = definedTokens(p3Index === -1 ? '' : css.slice(p3Index));
  const defined = [];

  for (const role of ['neutral', ...colorRoles]) {
    const steps = (role === 'neutral' ? neutralSteps : colorSteps).map((step) => `--${role}-${step}`);
    const all = role === 'neutral' ? steps : [...steps, `--${role}-text`, `--${role}-inverse`];
    const present = all.filter((token) => srgb.has(token));

    if (present.length === 0) {
      if (requireAll) {
        errors.push(`${path}: role ${role} is missing`);
      }
      continue;
    }

    defined.push(role);
    const missing = all.filter((token) => !srgb.has(token));
    const missingP3 = steps.filter((token) => !p3.has(token));
    if (missing.length > 0) {
      errors.push(`${path}: role ${role} is incomplete, missing ${missing.join(', ')}`);
    }
    if (missingP3.length > 0) {
      errors.push(`${path}: role ${role} is incomplete in the P3 block, missing ${missingP3.join(', ')}`);
    }
  }

  return { defined, tokens: srgb };
}

checkRoles(rolesPath, readFileSync(rolesPath, 'utf8'), true);

for (const path of themeFiles) {
  const css = readFileSync(path, 'utf8');

  if (!css.startsWith(`${layerOrder}\n`)) {
    errors.push(`${path}: must start with the layer order statement`);
  }

  const { defined, tokens } = checkRoles(path, css, false);
  for (const [role, icon] of Object.entries(bakedIcons)) {
    if (defined.includes(role) && !tokens.has(icon)) {
      errors.push(`${path}: defines ${role} but not ${icon}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Theme check failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error('Run `npm run build:themes` to regenerate, and edit scripts/themes.json instead of the CSS files.');
  process.exit(1);
}

console.log(`Theme check passed: ${rolesPath} and ${themeFiles.length} theme files`);
