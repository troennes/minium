import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cssDir = 'css';
const distDir = 'dist';
const fontsDir = join(cssDir, 'fonts');
const integrationsDir = join(cssDir, 'integrations');
const distFontsDir = join(distDir, 'fonts');
const distIntegrationsDir = join(distDir, 'integrations');

const colorsPath = join(cssDir, 'colors.css');
const themePath = join(cssDir, 'theme.css');
const readableOutPath = join(distDir, 'minium.css');
const minOutPath = join(distDir, 'minium.min.css');

function removeComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function minifyCss(css) {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function collectUsedColorTokens(themeCss) {
  const tokens = new Set();
  const varRe = /var\(--([a-z0-9-]+)\)/gi;
  let match = varRe.exec(themeCss);

  while (match) {
    const token = match[1];
    if (/^[a-z]+-(?:a\d{1,2}|\d{1,2})$/i.test(token)) {
      tokens.add(token);
    }
    match = varRe.exec(themeCss);
  }

  return tokens;
}

function collectDefinedColorTokens(colorsCss) {
  const defs = new Map();
  const defRe = /(^|\n)\s*--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match = defRe.exec(colorsCss);

  while (match) {
    defs.set(match[2], match[3].trim());
    match = defRe.exec(colorsCss);
  }

  return defs;
}

function splitColorSources(colorsCss) {
  const p3Marker = '@supports (color: color(display-p3 1 1 1))';
  const p3Index = colorsCss.indexOf(p3Marker);

  if (p3Index === -1) {
    console.error('Expected P3 color block was not found in css/colors.css.');
    process.exit(1);
  }

  return {
    baseSource: colorsCss.slice(0, p3Index),
    p3Source: colorsCss.slice(p3Index)
  };
}

function buildPrunedColorsCss(colorsCss, themeCss) {
  const usedTokens = collectUsedColorTokens(themeCss);
  const { baseSource, p3Source } = splitColorSources(colorsCss);
  const baseTokens = collectDefinedColorTokens(baseSource);
  const p3Tokens = collectDefinedColorTokens(p3Source);

  const missingBase = [...usedTokens].filter((token) => !baseTokens.has(token)).sort();
  if (missingBase.length > 0) {
    console.error('Missing fallback color token definitions in css/colors.css:');
    for (const token of missingBase) {
      console.error(`- --${token}`);
    }
    process.exit(1);
  }

  const sortedTokens = [...usedTokens].sort((a, b) => a.localeCompare(b));
  const baseLines = sortedTokens.map((token) => `    --${token}: ${baseTokens.get(token)};`);
  const p3Lines = sortedTokens.map((token) => `        --${token}: ${p3Tokens.get(token) ?? baseTokens.get(token)};`);

  return (
    '@layer tokens {\n' +
    '  :root {\n' +
    `${baseLines.join('\n')}\n` +
    '  }\n\n' +
    '  @supports (color: color(display-p3 1 1 1)) {\n' +
    '    @media (color-gamut: p3) {\n' +
    '      :root {\n' +
    `${p3Lines.join('\n')}\n` +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}\n'
  );
}

function buildBundleOrder() {
  const cssFiles = readdirSync(cssDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => entry.name);

  const fixedStart = ['theme.css', 'reset.css', 'base.css', 'typography.css', 'layout.css'];
  const fixedEnd = ['utilities.css'];
  const excluded = new Set(['colors.css', ...fixedStart, ...fixedEnd]);

  const middle = cssFiles
    .filter((file) => !excluded.has(file))
    .sort((a, b) => a.localeCompare(b));

  return [...fixedStart, ...middle, ...fixedEnd];
}

function copyFonts() {
  mkdirSync(distFontsDir, { recursive: true });
  const fontFiles = readdirSync(fontsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  for (const file of fontFiles) {
    copyFileSync(join(fontsDir, file), join(distFontsDir, file));
  }
}

function copyIntegrations() {
  mkdirSync(distIntegrationsDir, { recursive: true });
  const integrationFiles = readdirSync(integrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  for (const file of integrationFiles) {
    const source = readFileSync(join(integrationsDir, file), 'utf8');
    const content = removeComments(source).trim() + '\n';
    writeFileSync(join(distIntegrationsDir, file), content, 'utf8');
  }

  return integrationFiles.length;
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const colorsCss = readFileSync(colorsPath, 'utf8');
const themeCss = readFileSync(themePath, 'utf8');
const prunedColorsCss = removeComments(buildPrunedColorsCss(colorsCss, themeCss));

const orderedFiles = buildBundleOrder();
const bundleParts = [prunedColorsCss];

for (const file of orderedFiles) {
  const path = join(cssDir, file);
  const content = removeComments(readFileSync(path, 'utf8')).trim();
  bundleParts.push(`\n${content}\n`);
}

const readableCss = bundleParts.join('\n').trim() + '\n';
const minifiedCss = minifyCss(readableCss) + '\n';

writeFileSync(readableOutPath, readableCss, 'utf8');
writeFileSync(minOutPath, minifiedCss, 'utf8');
copyFonts();
const integrationCount = copyIntegrations();

console.log(`Built ${readableOutPath}`);
console.log(`Built ${minOutPath}`);
console.log(`Copied fonts to ${distFontsDir}`);
console.log(`Built ${integrationCount} integration files in ${distIntegrationsDir}`);
