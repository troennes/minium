# Color themes plan

Status: implemented.

## Goals

- Switch theme by loading one extra stylesheet. No build step for users.
- Keep CSS size minimal: core carries one default theme, each extra theme is a small opt-in file.
- Keep Radix quality, including Display P3 colors.
- Take `css/colors.css` out of the build (kept as a reference file) and remove the color pruning in `scripts/build-css.mjs`.

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
| `warning` | amber | |
| `info` | blue | |

Step sets:

- `neutral`: 1, 2, 3, 4, 5, 8, 11, 12, a2–a7
- Colored roles (all six share the same set, so any scale fits any role): 7, 9, 10, 11, a2–a7, a11, plus `--<role>-text` and `--<role>-inverse`

Role slots are named after Radix steps and always hold that step's value, so values can be copied straight from radix-ui.com or `@radix-ui/colors`. When a scale needs different behavior, the theme overrides semantic tokens instead of putting other steps into the slots (see [Overrides](#overrides)).

`--<role>-inverse` is the text color on the role's step 9 solid. It belongs to the scale, not the role: white for most scales, dark for bright scales (sky, mint, lime, yellow, amber). Every `--color-<role>-inverse` in core points at `--<role>-inverse`; none are hardcoded.

`--<role>-text` is the role's text color, also owned by the scale: step 11 for most scales. Step 11 of a bright scale drifts to brown or olive in light mode and reads as a different color next to the step 9 solid, so bright scales use the neutral's darkest step instead:

| Slot | Most scales | Bright scales |
|---|---|---|
| `--<role>-text` | `var(--<role>-11)` | `light-dark(var(--neutral-12), var(--<role>-11))` |
| `--<role>-inverse` | `white` | `light-dark(var(--neutral-12), var(--neutral-1))` |

Both reference other slots, so they need no P3 values and follow the theme's neutral. Every `--color-<role>-text` in core points at `--<role>-text`. This matches Radix, whose bright scales' contrast colors are the paired gray's step 12.

Each step is defined as `light-dark(<light>, <dark>)` in sRGB hex, with a Display P3 override block:

```css
@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    :root { /* P3 values for the same tokens */ }
  }
}
```

Tokens that are not themed (`--white-a10`, `--black-a7`) become literal values in the tokens that use them.

### Core mapping

Core maps every semantic and element token to a role step. Radix scales share one step contract (step 8 is a solid border, a5 a subtle tint, and so on) at matching lightness, so a tweak tuned on one scale works on the others. Examples:

| Token | Today | Core |
|---|---|---|
| `--mark-color` | `light-dark(orange-a5, orange-a11)` | `light-dark(var(--primary-a5), var(--primary-a11))` |
| `--switch-color-surface` | `light-dark(sand-8, color-fill)` | `light-dark(var(--neutral-8), var(--color-fill))` |
| `--color-danger-fill` | `light-dark(red-a2, red-a3)` | `light-dark(var(--danger-a2), var(--danger-a3))` |
| `--color-warning-border-weak` | `amber-a6` | `var(--warning-a6)` |

Role-specific tweaks (danger's `light-dark(a2, a3)` fills, warning's a6/a7 borders) stay in core, so they apply to whatever scale fills the role. The scales the mapping puts in those roles (crimson, tomato for danger; orange, yellow for warning) are close enough that the same tweaks hold.

### Overrides

A theme overrides a semantic token only when its scale breaks the step contract for a role. Overrides come from the type of scale, not the individual theme, so the same block applies to every theme of that type.

| Scale type | Themes | Overrides |
|---|---|---|
| Gray scale as primary | gray, mauve, slate, sage, olive, sand | `--color-primary` → step 12, `--color-primary-inverse` → step 1, `--color-primary-hover` (value to be tuned, step 12 has no darker step), `--mark-color` → accent (a gray highlight is useless), `--color-primary-text` if it's the same as `--color-text-muted` |
| Bright scale (sky, mint, lime, yellow, amber) in any colored role | several | None: dark text comes from the `--<role>-text` and `--<role>-inverse` role values |

Role text on light backgrounds uses `--<role>-text` (step 11, or neutral 12 for bright scales), never step 9.

### Layers

`css/colors.css` leaves the build, which frees `@layer tokens`:

| Layer | Contents |
|---|---|
| `tokens` | All library defaults: role values (default theme, in the generated `css/roles.css`), semantic mappings, radii, shadows, fonts, spacing. Everything in `theme.css` today moves here. |
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
- A theme is named after its primary scale.
- Themes may be partial: a theme defines only what differs from the default, the rest falls back to core.
- **Each role is all or nothing**: a theme that defines any `--danger-*` step defines all of them, including `--danger-inverse`.

Usage:

```html
<link rel="stylesheet" href="minium.min.css">
<link rel="stylesheet" href="themes/blue.css">
```

Size: about 0.35 KB gzip per colored role including P3. A three-role theme (neutral, primary, accent) is about 1.3 KB gzip; a full seven-role theme about 2.5 KB.

### Theme mapping

31 themes, one per Radix scale. Neutrals follow the Radix pairing guide. Status roles default to green / amber / red / blue. When the primary or accent is in the same hue family as a status role (or close to it), that role moves to a clearly different hue so the two stay distinguishable.

| Theme (primary) | Neutral | Accent | Success | Warning | Danger | Info |
|---|---|---|---|---|---|---|
| gray | gray | iris | green | amber | red | blue |
| mauve | mauve | violet | green | amber | red | blue |
| slate | slate | indigo | green | amber | red | sky |
| sage | sage | teal | green | amber | red | blue |
| olive | olive | lime | green | amber | red | blue |
| sand | sand | gold | green | amber | red | blue |
| bronze | sand | teal | green | amber | red | blue |
| gold | sand | purple | green | amber | red | blue |
| brown | sand | sky | green | amber | red | indigo |
| **orange** (default) | sand | indigo | green | amber | red | blue |
| tomato | mauve | teal | green | amber | crimson | blue |
| red | mauve | gold | green | amber | crimson | blue |
| ruby | mauve | jade | grass | amber | tomato | blue |
| crimson | mauve | cyan | green | amber | tomato | indigo |
| pink | mauve | mint | grass | amber | red | blue |
| plum | mauve | iris | green | amber | red | cyan |
| purple | mauve | gold | green | amber | red | blue |
| violet | mauve | pink | green | amber | red | blue |
| iris | slate | plum | green | amber | red | sky |
| indigo | slate | orange | green | yellow | red | cyan |
| blue | slate | purple | green | amber | red | cyan |
| cyan | slate | violet | green | amber | red | blue |
| sky | slate | pink | green | amber | red | blue |
| teal | sage | orange | green | yellow | red | blue |
| jade | sage | ruby | grass | amber | tomato | blue |
| green | sage | gold | teal | amber | red | blue |
| grass | olive | yellow | teal | orange | red | blue |
| mint | sage | pink | green | amber | red | blue |
| lime | olive | violet | jade | amber | red | blue |
| yellow | sand | green | teal | orange | red | blue |
| amber | sand | iris | green | orange | red | blue |

Accent choices: the accent never matches the theme's status colors. Some are complements (tomato → teal, indigo → orange), some adjacent (blue → purple, yellow → green, violet → pink), and some pair with an earthy tone (bronze → teal like patina, red/purple/green → gold, brown → sky).

Every row gets a theme file, including the current default. That gives 31 files. The default is expected to change (orange is a placeholder), and a file per row means:

- the theme switcher treats every theme the same, including the default,
- a user who picks `orange.css` explicitly keeps orange after the library's default changes.

The default's own file is nearly empty (only what core can't express, see [Generator](#generator)). That's harmless.

### Generator

Theme files are generated, not hand-written: 31 files with sRGB and P3 values are too error-prone to maintain by hand.

- The mapping table above lives as data (for example `scripts/themes.json`).
- `scripts/build-themes.mjs` (dev only) reads the mapping and `@radix-ui/colors` (dev dependency) and writes `css/themes/<name>.css`.
- `themes.json` names the default theme. The generator writes its role values to `css/roles.css` (core, `@layer tokens`). Changing the default means editing one line and regenerating.
- Each theme file is the difference from the default:
  - `neutral`, `primary` and `accent` are always emitted, so theme files stay stable when the default changes and the switcher never shows a mix of two themes.
  - Status roles are emitted only when they differ from the default's, together with the matching icon tokens.
  - Semantic overrides for the theme's scale type are emitted. If the default itself has overrides (for example a gray-primary default), themes without them emit the reset values.
- Changing the default regenerates every file; the guard check fails if they are stale.
- Inverse and role text: neutral-based for bright scales, white and step 11 otherwise (see [Roles](#roles)).
- Generated files are committed, so users and the `dist/` build never run the generator.

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

A small script in `npm test` catches hand edits and user-contributed themes:

- `css/themes/` matches the generator output.
- Each theme file defines each role completely or not at all.
- A theme that defines `danger` / `success` also defines `--icon-invalid` / `--icon-valid`.
- Each theme file starts with the layer order statement.

## Example: `themes/blue.css`

From the blue row: slate neutral, blue primary, purple accent, cyan info. Success, warning and danger use the defaults. Structure below with neutral and primary in full; accent (purple) and info (cyan) follow the same slot set.

```css
@layer tokens, theme, reset, base, layout, components, project, utilities;

/* Blue: slate neutral, blue primary, purple accent, cyan info */
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

    /* accent: purple (same slots as primary) */
    /* info: cyan (same slots as primary) */
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

        /* accent: purple, info: cyan */
      }
    }
  }
}
```

Note: the colored step set includes a7, which the original example omitted. The generator must emit it (`--color-warning-border-strong` uses warning a7, so any scale in any role needs it).

## Implementation steps

1. **Roles in core.** Move `theme.css` into `@layer tokens`. Add the seven roles with literal values (sRGB + P3) for the default scales. Point all semantic and element tokens at roles (see [Core mapping](#core-mapping)), including the element tokens that reference `--sand-*` / `--orange-*` directly today (`--header-color-surface`, `--code-color-surface`, `--code-inline-color-surface`, `--kbd-*`, `--mark-color`, `--switch-*`, `--dropdown-color-surface-hover`, `--form-*`, `--color-contrast*`). Point every `--color-<role>-inverse` at `--<role>-inverse`. Put the role values in their own file, `css/roles.css`, which the generator takes over in step 3. No visual change expected.
2. **Move `colors.css` out of the build.** Move it with `git mv` to `reference/colors.css`, and add a header comment saying it's a reference copy, not built or linted, and that the generator uses `@radix-ui/colors` as its source. At the top level it stays out of the build (which reads `css/*.css`), stylelint (`css/**/*.css`) and the npm package (`files: ["dist"]`). Remove the pruning in `scripts/build-css.mjs`; the build becomes concatenation plus copying `css/themes/` to `dist/themes/`.
3. **Generator.** Add `scripts/themes.json` (the mapping and the default), `scripts/build-themes.mjs` and `@radix-ui/colors` as a dev dependency. It writes `css/roles.css` and all 31 theme files, including the gray-primary override block and inverse rules. Regenerating with orange as default must leave `css/roles.css` unchanged from step 1.
4. **Guard check.** Add the theme validation script to `npm test`.
5. **First theme.** Generate `css/themes/blue.css` and verify light/dark, P3 and non-P3, Chromium and Firefox. Then verify one gray-primary theme (e.g. `slate`) and one bright-primary theme (e.g. `yellow`) to tune the overrides before generating the rest. Check `orange.css` switches back to the default look after another theme was loaded in the switcher.
6. **Docs.** Update `docs/customization.html` (layer meanings, themes section, role list, override pattern) and `llms.txt`. Add a theme switcher to the docs site (swap the theme `<link>` next to the light/dark toggle in `docs/main.js`).

## Later

- Themes that also change radii, shadows and fonts (no architectural change needed).
- `appearance: base-select` / `::picker-icon` may make the select icon maskable once supported beyond Chromium.
