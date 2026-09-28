# Color themes plan

Status: agreed direction, not implemented.

## Goals

- Switch theme by loading one extra stylesheet. No build step for users.
- Keep CSS size minimal: core carries one default theme, each extra theme is a small opt-in file.
- Keep Radix quality, including Display P3 colors.
- Remove `css/colors.css` and the color pruning in `scripts/build-css.mjs`.

Themes are shipped by the library. Users can still write their own, so the role names below are public API once documented.

## Architecture

### Roles

Semantic tokens never reference palette names (`--sand-*`, `--orange-*`). They reference roles, and roles hold literal color values.

```
role value (--neutral-3: light-dark(#…, #…))  →  semantic (--color-surface-sunken)  →  components
```

Seven roles:

| Role | Default scale | Notes |
|---|---|---|
| `neutral` | sand | surfaces, text, borders |
| `primary` | orange | |
| `accent` | indigo | |
| `danger` | red | |
| `success` | green | |
| `warning` | amber | bright scale, dark inverse text |
| `info` | blue | |

Step sets:

- `neutral`: 1, 2, 3, 4, 5, 8, 11, 12, a2–a7
- Colored roles (all six share the same set, so any scale fits any role): 7, 9, 10, 11, a2–a7, a11, plus `--<role>-inverse`

Each step is defined as `light-dark(<light>, <dark>)` in sRGB hex, with a Display P3 override block:

```css
@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    :root { /* P3 values for the same tokens */ }
  }
}
```

Role-specific tweaks (for example danger's `light-dark(a2, a3)` fill, warning's a6/a7 borders) stay in core's semantic mapping, so they apply to whatever scale fills the role. A theme can override a single semantic token if its scale needs something different.

Tokens that are not themed (`--white-a10`, `--black-a7`) become literal values in the tokens that use them.

### Layers

`css/colors.css` is removed, which frees `@layer tokens`:

| Layer | Contents |
|---|---|
| `tokens` | All library defaults: role values (default theme), semantic mappings, radii, shadows, fonts, spacing. Everything in `theme.css` today moves here. |
| `theme` | Reserved for theme files and user-made themes. |
| `project` | User overrides, as today. |

Because theme files live in a higher layer than the defaults, they win regardless of load order, and can override anything: role colors, semantic tokens, radii, shadows, fonts.

Every theme file starts with the full layer order statement, so load order is irrelevant even if the theme loads before `minium.css`:

```css
@layer tokens, theme, reset, base, layout, components, project, utilities;
```

### Theme files

- Source: `css/themes/<name>.css`. Output: `dist/themes/<name>.css` (copied, not processed).
- Folder is `themes/`, not `color-themes/`, so themes can later include radii, shadows and fonts.
- Themes may be partial: a theme defines only the roles it changes, the rest fall back to the defaults.
- **Each role is all or nothing**: a theme that defines any `--danger-*` step defines all of them.

Usage:

```html
<link rel="stylesheet" href="minium.min.css">
<link rel="stylesheet" href="themes/ocean.css">
```

Size: about 0.35 KB gzip per colored role including P3. A three-role theme (neutral, primary, accent) is about 1.3 KB gzip; a full seven-role theme about 2.5 KB.

### Icons

Icons used via `mask` / `mask-image` (alerts, checkbox, chevrons, close, loading) take their color from tokens and need no change.

Four icons are used as `background-image` on `<input>` / `<select>` (no pseudo-elements available), with colors baked into the SVG data URI:

| Token | Used in | Baked color |
|---|---|---|
| `--icon-search` | `form.css` search input | neutral gray |
| `--icon-select` | `form.css` select | neutral gray |
| `--icon-valid` | `form.css` valid state | green |
| `--icon-invalid` | `form.css` invalid state | red |

Rules:

- A theme that changes `danger` also redefines `--icon-invalid`; a theme that changes `success` also redefines `--icon-valid`. Alerts keep working since masks ignore the stroke color.
- `--icon-search` and `--icon-select` keep a mid gray that works on any neutral. Themes may redefine them, but don't have to.
- Known limitation (unchanged): baked colors are the same in light and dark mode.

### Guard check

A small script in `npm test` replaces the safety net the pruning build gave us:

- Each theme file defines each role completely or not at all.
- A theme that defines `danger` / `success` also defines `--icon-invalid` / `--icon-valid`.
- Each theme file starts with the layer order statement.

## Example: `themes/ocean.css`

Cold gray neutral (slate), blue primary, green accent (grass). Status roles use the defaults.

```css
@layer tokens, theme, reset, base, layout, components, project, utilities;

/* Ocean: cold gray neutral (slate), blue primary, green accent (grass) */
@layer theme {
  :root {
    /* neutral: slate */
    --neutral-1: light-dark(#fcfcfd, #111113);
    --neutral-2: light-dark(#f9f9fb, #18191b);
    --neutral-3: light-dark(#f0f0f3, #212225);
    --neutral-4: light-dark(#e8e8ec, #272a2d);
    --neutral-5: light-dark(#e0e1e6, #2e3135);
    --neutral-8: light-dark(#b9bbc6, #5a6169);
    --neutral-11: light-dark(#60646c, #b0b4ba);
    --neutral-12: light-dark(#1c2024, #edeef0);
    --neutral-a2: light-dark(#00005506, #d8f4f609);
    --neutral-a3: light-dark(#0000330f, #ddeaf814);
    --neutral-a4: light-dark(#00002d17, #d3edf81d);
    --neutral-a5: light-dark(#0009321f, #d9edfe25);
    --neutral-a6: light-dark(#00002f26, #d6ebfd30);
    --neutral-a7: light-dark(#00062e32, #d9edff40);

    /* primary: blue */
    --primary-7: light-dark(#8ec8f6, #205d9e);
    --primary-9: light-dark(#0090ff, #0090ff);
    --primary-10: light-dark(#0588f0, #3b9eff);
    --primary-11: light-dark(#0d74ce, #70b8ff);
    --primary-a2: light-dark(#008cff0b, #1166fb18);
    --primary-a3: light-dark(#008ff519, #0077ff3a);
    --primary-a4: light-dark(#009eff2a, #0075ff57);
    --primary-a5: light-dark(#0093ff3d, #0081fd6b);
    --primary-a6: light-dark(#0088f653, #0f89fd7f);
    --primary-a11: light-dark(#006dcbf2, #70b8ff);
    --primary-inverse: white;

    /* accent: grass */
    --accent-7: light-dark(#94ce9a, #366740);
    --accent-9: light-dark(#46a758, #46a758);
    --accent-10: light-dark(#3e9b4f, #53b365);
    --accent-11: light-dark(#2a7e3b, #71d083);
    --accent-a2: light-dark(#0099000a, #5ef7780a);
    --accent-a3: light-dark(#00970016, #70fe8c1b);
    --accent-a4: light-dark(#009f0725, #57ff802c);
    --accent-a5: light-dark(#00930536, #68ff8b3b);
    --accent-a6: light-dark(#008f0a4d, #71ff8f4b);
    --accent-a11: light-dark(#006514d5, #89ff9fcd);
    --accent-inverse: white;
  }

  @supports (color: color(display-p3 1 1 1)) {
    @media (color-gamut: p3) {
      :root {
        /* neutral: slate */
        --neutral-1: light-dark(color(display-p3 0.988 0.988 0.992), color(display-p3 0.067 0.067 0.074));
        --neutral-2: light-dark(color(display-p3 0.976 0.976 0.984), color(display-p3 0.095 0.098 0.105));
        --neutral-3: light-dark(color(display-p3 0.94 0.941 0.953), color(display-p3 0.13 0.135 0.145));
        --neutral-4: light-dark(color(display-p3 0.908 0.909 0.925), color(display-p3 0.156 0.163 0.176));
        --neutral-5: light-dark(color(display-p3 0.88 0.881 0.901), color(display-p3 0.183 0.191 0.206));
        --neutral-8: light-dark(color(display-p3 0.727 0.733 0.773), color(display-p3 0.357 0.381 0.409));
        --neutral-11: light-dark(color(display-p3 0.379 0.392 0.421), color(display-p3 0.692 0.704 0.728));
        --neutral-12: light-dark(color(display-p3 0.113 0.125 0.14), color(display-p3 0.93 0.933 0.94));
        --neutral-a2: light-dark(color(display-p3 0.024 0.024 0.349 / 0.024), color(display-p3 0.875 0.992 1 / 0.034));
        --neutral-a3: light-dark(color(display-p3 0.004 0.004 0.204 / 0.059), color(display-p3 0.882 0.933 0.992 / 0.077));
        --neutral-a4: light-dark(color(display-p3 0.012 0.012 0.184 / 0.091), color(display-p3 0.882 0.953 0.996 / 0.111));
        --neutral-a5: light-dark(color(display-p3 0.004 0.039 0.2 / 0.122), color(display-p3 0.878 0.929 0.996 / 0.145));
        --neutral-a6: light-dark(color(display-p3 0.008 0.008 0.165 / 0.15), color(display-p3 0.882 0.949 0.996 / 0.183));
        --neutral-a7: light-dark(color(display-p3 0.008 0.027 0.184 / 0.197), color(display-p3 0.882 0.929 1 / 0.246));

        /* primary: blue */
        --primary-7: light-dark(color(display-p3 0.606 0.777 0.947), color(display-p3 0.195 0.361 0.6));
        --primary-9: light-dark(color(display-p3 0.247 0.556 0.969), color(display-p3 0.247 0.556 0.969));
        --primary-10: light-dark(color(display-p3 0.234 0.523 0.912), color(display-p3 0.344 0.612 0.973));
        --primary-11: light-dark(color(display-p3 0.15 0.44 0.84), color(display-p3 0.49 0.72 1));
        --primary-a2: light-dark(color(display-p3 0.024 0.514 0.906 / 0.04), color(display-p3 0.114 0.435 0.988 / 0.085));
        --primary-a3: light-dark(color(display-p3 0.012 0.506 0.914 / 0.087), color(display-p3 0.122 0.463 1 / 0.219));
        --primary-a4: light-dark(color(display-p3 0.008 0.545 1 / 0.146), color(display-p3 0 0.467 1 / 0.324));
        --primary-a5: light-dark(color(display-p3 0.004 0.502 0.984 / 0.212), color(display-p3 0.098 0.51 1 / 0.4));
        --primary-a6: light-dark(color(display-p3 0.004 0.463 0.922 / 0.291), color(display-p3 0.224 0.557 1 / 0.475));
        --primary-a11: light-dark(color(display-p3 0.15 0.44 0.84), color(display-p3 0.49 0.72 1));

        /* accent: grass */
        --accent-7: light-dark(color(display-p3 0.628 0.803 0.622), color(display-p3 0.258 0.4 0.264));
        --accent-9: light-dark(color(display-p3 0.38 0.647 0.378), color(display-p3 0.38 0.647 0.378));
        --accent-10: light-dark(color(display-p3 0.344 0.598 0.342), color(display-p3 0.426 0.694 0.426));
        --accent-11: light-dark(color(display-p3 0.263 0.488 0.261), color(display-p3 0.535 0.807 0.542));
        --accent-a2: light-dark(color(display-p3 0.024 0.565 0.024 / 0.036), color(display-p3 0.482 0.996 0.584 / 0.038));
        --accent-a3: light-dark(color(display-p3 0.059 0.576 0.008 / 0.083), color(display-p3 0.549 0.992 0.588 / 0.106));
        --accent-a4: light-dark(color(display-p3 0.035 0.565 0.008 / 0.134), color(display-p3 0.51 0.996 0.557 / 0.169));
        --accent-a5: light-dark(color(display-p3 0.047 0.545 0.008 / 0.197), color(display-p3 0.553 1 0.588 / 0.227));
        --accent-a6: light-dark(color(display-p3 0.031 0.502 0.004 / 0.275), color(display-p3 0.584 1 0.608 / 0.29));
        --accent-a11: light-dark(color(display-p3 0.263 0.488 0.261), color(display-p3 0.535 0.807 0.542));
      }
    }
  }
}
```

Note: check white text contrast on grass-9 when finalizing this theme.

## Implementation steps

1. **Roles in core.** Move `theme.css` into `@layer tokens`. Add the seven roles with literal values (sRGB + P3) for the default scales. Point all semantic and element tokens at roles, including the element tokens that reference `--sand-*` / `--orange-*` directly today (`--header-color-surface`, `--code-color-surface`, `--code-inline-color-surface`, `--kbd-*`, `--mark-color`, `--switch-*`, `--dropdown-color-surface-hover`, `--form-*`, `--color-contrast*`). No visual change expected.
2. **Remove `colors.css`.** Delete it and the pruning in `scripts/build-css.mjs`; the build becomes concatenation plus copying `css/themes/` to `dist/themes/`. New theme values come from radix-ui.com/colors or the `@radix-ui/colors` package.
3. **Guard check.** Add the theme validation script to `npm test`.
4. **First theme.** Add `css/themes/ocean.css` and verify light/dark, P3 and non-P3, Chromium and Firefox.
5. **Docs.** Update `docs/customization.html` (layer meanings, themes section, role list) and `llms.txt`. Add a theme switcher to the docs site (swap the theme `<link>` next to the light/dark toggle in `docs/main.js`).

## Later

- Themes that also change radii, shadows and fonts (no architectural change needed).
- `appearance: base-select` / `::picker-icon` may make the select icon maskable once supported beyond Chromium.
