/* Minium builder UI: loads the source CSS, reads the form, and shows, sizes and downloads the build */
import {
  ALL_FILES, MODULES, ROLES, buildCss, buildScaleLibrary, swatchColor, themeMapping,
} from "./builder-core.js";

const form = document.querySelector("#builder");
const status = document.querySelector("#builder-status");
const output = document.querySelector("#builder-output");
const preview = document.querySelector("#builder-preview");
const sizeText = document.querySelector("#builder-size");

const PREVIEW_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style id="build"></style></head><body>
<header data-module="nav">
  <nav class="container">
    <ul><li><strong>Acme</strong></li></ul>
    <ul>
      <li><a href="#">Docs</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#" role="button">Sign up</a></li>
    </ul>
  </nav>
</header>
<main class="container flow">
  <hgroup>
    <h1>Preview</h1>
    <p>Semantic HTML with your modules, colors and tokens. Here is <a href="#">a link</a> and some <code>inline code</code>.</p>
  </hgroup>

  <nav class="tabs" aria-label="Sections" data-module="nav">
    <ul>
      <li><a href="#" aria-current="page">Overview</a></li>
      <li><a href="#">Activity</a></li>
      <li><a href="#">Settings</a></li>
    </ul>
  </nav>

  <div class="cluster">
    <button>Primary</button>
    <button class="secondary">Secondary</button>
    <button class="accent">Accent</button>
    <button class="danger">Danger</button>
    <button class="contrast">Contrast</button>
  </div>

  <section class="grid halves">
    <article class="card" data-module="card">
      <h2>Account settings</h2>
      <form>
        <label>Workspace name <input type="text" value="Acme Analytics"></label>
        <label>Plan
          <select><option>Team</option><option>Business</option></select>
        </label>
        <label><input type="checkbox" role="switch" checked> Send a weekly summary</label>
        <button type="button">Save changes</button>
      </form>
    </article>
    <article class="card" data-module="card">
      <p class="eyebrow">Monthly revenue</p>
      <h2>$124,560</h2>
      <p data-module="badge"><span class="badge success">+12.4%</span> <span class="badge info">Info</span> <span class="badge warning">Warning</span></p>
      <p data-module="progress"><progress value="72" max="100">72%</progress></p>
      <div data-module="avatar"><figure class="avatar">KT</figure> <figure class="avatar small">A</figure></div>
    </article>
  </section>

  <div class="flow" data-module="alert">
    <div class="alert primary">A primary alert with <a href="#">a link</a>.</div>
    <div class="alert success">Your changes were saved.</div>
    <div class="alert danger">Something went wrong.</div>
  </div>

  <div role="group" data-module="accordion">
    <details name="faq" open>
      <summary>Does Minium require JavaScript?</summary>
      <p>No. Minium has no JavaScript dependency.</p>
    </details>
    <details name="faq">
      <summary>Can I use it commercially?</summary>
      <p>Yes. Minium is MIT licensed.</p>
    </details>
  </div>

  <div class="cluster">
    <div class="dropdown" data-module="dropdown">
      <button popovertarget="preview-menu">Dropdown</button>
      <nav id="preview-menu" popover aria-label="Actions">
        <ul>
          <li><a href="#">Edit</a></li>
          <li><a href="#">Duplicate</a></li>
          <li><a href="#">Archive</a></li>
        </ul>
      </nav>
    </div>
    <button class="secondary" data-tooltip="A CSS-only tooltip" data-module="tooltip">Tooltip</button>
    <button class="secondary" commandfor="preview-modal" command="show-modal" data-module="modal">Open modal</button>
  </div>

  <dialog id="preview-modal" aria-label="Greeting" data-module="modal">
    <p>Greetings, one and all!</p>
    <form method="dialog"><button>Close modal</button></form>
  </dialog>

  <article aria-busy="true" aria-label="Loading content" data-module="skeleton">
    <div class="skeleton line" aria-hidden="true"></div>
    <div class="skeleton line" aria-hidden="true" style="inline-size: 72%;"></div>
  </article>

  <table>
    <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>Ada</td><td>Admin</td><td>Active</td></tr>
      <tr><td>Linus</td><td>Editor</td><td>Invited</td></tr>
    </tbody>
  </table>

  <pre class="language-css" data-module="prism"><code>@layer project {
  .hero {
    padding: var(--space-l);
  }
}</code></pre>

  <form data-module="django">
    <div>
      <label for="id_email">Email</label>
      <input type="email" id="id_email" value="ada@example">
      <span class="helptext">We never share your email.</span>
      <ul class="errorlist"><li>Enter a valid email address.</li></ul>
    </div>
  </form>
</main>
<script src="prism.js"></script>
</body></html>`;

let source;
let previewMode = "light";
let latest;

async function fetchText(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.text();
}

async function loadSource() {
  const [pkg, themesConfig] = await Promise.all([
    fetchText("../package.json").then(JSON.parse),
    fetchText("../scripts/themes.json").then(JSON.parse),
  ]);
  const themeNames = Object.keys(themesConfig.themes);
  const [cssTexts, themeTexts] = await Promise.all([
    Promise.all(ALL_FILES.map((file) => fetchText(`../css/${file}`))),
    Promise.all(themeNames.map((name) => fetchText(`../css/themes/${name}.css`))),
  ]);
  const sources = new Map(ALL_FILES.map((file, i) => [file, cssTexts[i]]));
  const library = buildScaleLibrary([sources.get("roles.css"), ...themeTexts], themesConfig);

  return { version: pkg.version, themesConfig, themeNames, sources, library };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/* Position of a hex color on the color wheel, for ordering swatches */
function hue(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  if (!delta) return 0;
  const h = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return (h * 60 + 360 + 15) % 360; // rotated so reds start the list
}

function moduleCheckboxes(group, checked) {
  return MODULES.filter((module) => (module.group ?? "components") === group).map((module) => `
    <label><input type="checkbox" name="module" value="${module.id}"${checked ? " checked" : ""}> ${module.label}</label>`).join("");
}

function renderControls() {
  document.querySelector("#builder-modules").innerHTML = moduleCheckboxes("components", true);
  document.querySelector("#builder-integrations").innerHTML = moduleCheckboxes("integrations", false);

  const { themesConfig, themeNames, library } = source;
  const isGray = (name) => library.grayScales.includes(name);
  const byHue = (a, b) => hue(swatchColor(library, a)) - hue(swatchColor(library, b));
  const sorted = [...themeNames.filter((name) => !isGray(name)).sort(byHue), ...themeNames.filter(isGray).sort()];
  /* Cards are filled with the theme color. Grays use step 11, since white text on their step 9 is too faint. */
  const card = (name) => {
    const color = swatchColor(library, name, isGray(name) ? "11" : "9");
    const bright = library.brightScales.includes(name) ? ' class="bright"' : "";
    const checked = name === themesConfig.default ? " checked" : "";
    return `<label${bright} style="--swatch: ${color}"><input type="radio" name="theme" value="${name}"${checked}>
      ${capitalize(name)}</label>`;
  };
  document.querySelector("#builder-themes").innerHTML = sorted.map(card).join("")
    + `<label class="custom"><input type="radio" name="theme" value="custom"> <span class="theme-swatch custom"></span> Custom</label>`;

  const neutralScales = Object.keys(library.neutral).sort();
  const colorScales = Object.keys(library.color).sort();
  document.querySelector("#builder-roles").innerHTML = ROLES.map((role) => {
    const scales = role === "neutral" ? neutralScales : colorScales;
    return `<label><span class="cluster gap-2xs"><span class="theme-swatch" data-role-swatch="${role}"></span> ${capitalize(role)}</span>
      <select name="role-${role}">${scales.map((scale) => `<option value="${scale}">${capitalize(scale)}</option>`).join("")}</select>
    </label>`;
  }).join("");

  applyThemeToRoles(themesConfig.default);
}

function applyThemeToRoles(name) {
  const mapping = themeMapping(source.themesConfig, name);
  for (const role of ROLES) form.elements[`role-${role}`].value = mapping[role];
  updateRoleSwatches();
}

function updateRoleSwatches() {
  for (const role of ROLES) {
    const element = form.querySelector(`[data-role-swatch="${role}"]`);
    element.style.background = swatchColor(source.library, form.elements[`role-${role}`].value);
  }
}

function readOptions() {
  const data = new FormData(form);
  const mapping = Object.fromEntries(ROLES.map((role) => [role, data.get(`role-${role}`)]));
  const contentWidth = Number(data.get("contentWidth"));

  return {
    moduleIds: data.getAll("module"),
    theme: data.get("theme"),
    mapping,
    tokens: {
      radius: data.get("radius"),
      fonts: data.get("fonts"),
      scale: Number(data.get("scale")),
      contentWidth: contentWidth && contentWidth !== 68 ? contentWidth : null,
      borderWidth: data.get("borderWidth") === "1" ? null : Number(data.get("borderWidth")),
      fontBaseUrl: `https://cdn.jsdelivr.net/npm/@troennes/minium@${source.version}/dist/fonts/`,
    },
  };
}

function describe(options) {
  const colors = options.theme === "custom"
    ? `custom (${ROLES.map((role) => `${role}: ${options.mapping[role]}`).join(", ")})`
    : options.theme;
  const { radius, fonts, scale, contentWidth, borderWidth } = options.tokens;
  const tokens = [
    radius !== "medium" && `radius: ${radius}`,
    fonts !== "default" && `fonts: ${fonts}`,
    scale !== 1 && `scale: ${Math.round(scale * 100)}%`,
    contentWidth && `content width: ${contentWidth}ch`,
    borderWidth && `border width: ${borderWidth}px`,
  ].filter(Boolean);
  const date = new Date().toISOString().slice(0, 10);

  return `Minium ${source.version}+main custom build, ${date} | modules: core${options.moduleIds.map((id) => `, ${id}`).join("")}`
    + ` | colors: ${colors}${tokens.length ? ` | ${tokens.join(", ")}` : ""} | https://minium.style/docs/builder.html`;
}

async function gzipSize(text) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  return (await new Response(stream).arrayBuffer()).byteLength;
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function updatePreview(options) {
  const doc = preview.contentDocument;
  const style = doc?.querySelector("#build");
  if (!style) return;

  style.textContent = latest.css;
  doc.documentElement.dataset.theme = previewMode;
  for (const element of doc.querySelectorAll("[data-module]")) {
    element.hidden = !options.moduleIds.includes(element.dataset.module);
  }
  fitPreview();
}

/* Grow the iframe to its content, also after web fonts change the text height */
function fitPreview() {
  const doc = preview.contentDocument;
  if (!doc?.documentElement) return;
  const fit = () => {
    preview.style.blockSize = "";
    preview.style.blockSize = `${doc.documentElement.scrollHeight}px`;
  };
  fit();
  doc.fonts?.ready.then(fit);
}

let pending = 0;
async function rebuild() {
  const run = ++pending;
  const options = readOptions();

  try {
    latest = buildCss({
      sources: source.sources,
      moduleIds: options.moduleIds,
      mapping: options.mapping,
      library: source.library,
      tokens: options.tokens,
      header: describe(options),
    });
  } catch (error) {
    sizeText.textContent = `Could not build: ${error.message}`;
    return;
  }

  updatePreview(options);
  const size = await gzipSize(latest.minified);
  if (run !== pending) return;
  sizeText.textContent = `Your build: ${formatKb(size)} gzipped (${formatKb(latest.minified.length)} minified).`;
}

function download() {
  const blob = new Blob([latest.minified], { type: "text/css" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "minium.custom.min.css";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function copy(button) {
  const label = button.textContent;
  try {
    await navigator.clipboard.writeText(latest.minified);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Copy failed";
  }
  setTimeout(() => { button.textContent = label; }, 1500);
}

form.addEventListener("change", (event) => {
  if (event.target.name === "theme") {
    if (event.target.value === "custom") document.querySelector("#builder-custom-roles").open = true;
    else applyThemeToRoles(event.target.value);
  } else if (event.target.name?.startsWith("role-")) {
    form.querySelector('input[name="theme"][value="custom"]').checked = true;
    updateRoleSwatches();
  }
  rebuild();
});
form.addEventListener("input", (event) => {
  if (event.target.type === "number") rebuild();
});
form.addEventListener("submit", (event) => event.preventDefault());

document.querySelector("#builder-preview-mode").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;
  previewMode = button.dataset.mode;
  for (const other of event.currentTarget.querySelectorAll("[data-mode]")) {
    other.setAttribute("aria-pressed", String(other === button));
  }
  updatePreview(readOptions());
});

document.querySelector("#builder-download").addEventListener("click", download);
document.querySelector("#builder-copy").addEventListener("click", (event) => copy(event.currentTarget));

try {
  source = await loadSource();
  renderControls();
  preview.addEventListener("load", rebuild);
  preview.srcdoc = PREVIEW_HTML;
  form.hidden = false;
  output.hidden = false;
  status.remove();
} catch (error) {
  status.textContent = `Could not load the source files (${error.message}). The builder needs to run from a web server, not a local file.`;
}
