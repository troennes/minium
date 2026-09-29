import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cssDir = 'css';
const distDir = 'dist';
const fontsDir = join(cssDir, 'fonts');
const integrationsDir = join(cssDir, 'integrations');
const distFontsDir = join(distDir, 'fonts');
const distIntegrationsDir = join(distDir, 'integrations');
const themesDir = join(cssDir, 'themes');
const distThemesDir = join(distDir, 'themes');

const readableOutPath = join(distDir, 'minium.css');
const minOutPath = join(distDir, 'minium.min.css');

function removeComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function minifyCss(css) {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .trim();
}

function buildBundleOrder() {
  const cssFiles = readdirSync(cssDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => entry.name);

  const fixedStart = ['theme.css', 'roles.css', 'reset.css', 'base.css', 'typography.css', 'layout.css'];
  const fixedEnd = ['utilities.css'];
  const excluded = new Set([...fixedStart, ...fixedEnd]);

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

// Theme files are copied as-is (not processed)
function copyThemes() {
  if (!existsSync(themesDir)) {
    return 0;
  }

  mkdirSync(distThemesDir, { recursive: true });
  const themeFiles = readdirSync(themesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  for (const file of themeFiles) {
    copyFileSync(join(themesDir, file), join(distThemesDir, file));
  }

  return themeFiles.length;
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const orderedFiles = buildBundleOrder();
const bundleParts = [];

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
const themeCount = copyThemes();

console.log(`Built ${readableOutPath}`);
console.log(`Built ${minOutPath}`);
console.log(`Copied fonts to ${distFontsDir}`);
console.log(`Built ${integrationCount} integration files in ${distIntegrationsDir}`);
console.log(`Copied ${themeCount} theme files to ${distThemesDir}`);
