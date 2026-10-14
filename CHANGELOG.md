# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-10-14

Minium v0.3 replaces the small drop shadow on buttons, badges, and form
controls with a slightly darker bottom border. The edge stays crisp at every
zoom level and follows the border color of each variant. This release also
adds split buttons and fixes the sizing of checkboxes, radios, switches, file
inputs, and range sliders.

### Added

- **Split buttons:** Inside a `role="group"`, place a `.dropdown` after a
  button to join a main action with a menu of related actions. 
- **Group dividers:** Adjacent buttons in a `role="group"` now have a divider
  line that contrasts in every theme and color variant.
- **Avatar image edge:** Image avatars have a faint inset edge, so very light
  or very dark photos stay distinct from the surface behind them.

### Changed

- **Breaking — `--shadow-small`:** The token now holds a `color-mix()` amount
  (`black 8%`) instead of a `box-shadow` value. A declaration such as
  `box-shadow: var(--shadow-small)` no longer draws a shadow.
- **Breaking — `.shadow-s`:** The utility now sets a darker bottom border
  instead of a `box-shadow`. On an element without a border, `.shadow-s` adds
  a subtle 1px bottom border.
- **Bottom edge instead of shadow:** The following elements now have a darker
  bottom border instead of a drop shadow: buttons, badges, inputs, selects,
  textareas, checkboxes, radios, switches, file inputs, accordions,
  pagination, and Prism toolbar items.
- **Switch and range knobs:** Both knobs are now white with a thin rim.
- **Checked switch track:** On themes with a bright primary color, the checked
  track is darker, so the white knob stays visible.

### Fixed

- Checkboxes, radios, and switches now render at whole-pixel sizes, so their
  ring, dot, and knob stay sharp and centered at 100% zoom.
- Valid and invalid checkboxes and radios now draw the check mark and dot in
  the matching success or danger inverse color instead of the primary inverse
  color.
- File inputs:
  - The button fills the field height at fractional zoom levels.
  - The button joins the field border and has rounded leading corners.
  - `.small` and `.large` file inputs match the height of text inputs.
- The range thumb now sits centered on the track.
- The meter bar now fills the full height of `meter` in Chromium-based
  browsers.
- A dropdown inside a `role="group"` no longer loses the borders of the
  elements in its panel.
- Group corners now use logical properties, so they render correctly in
  right-to-left layouts.
- Group (`role="group"`) styles now apply to direct children only.

### Upgrade from 0.2

1. Update the version in your CDN URL or run
   `npm install @troennes/minium@0.3.0`.
2. Search your CSS for `var(--shadow-small)`. In a `box-shadow` declaration,
   replace it with your own shadow value, or use the `.shadow-s` utility for
   the new bottom edge.
3. If you override `border-color` on a button, badge, or form control, set
   `--border-color` instead. A plain `border-color` override still works, but
   it removes the darker bottom edge.

## [0.2.0] - 2026-10-08

Minium v0.2 adds color themes. To switch the color scheme of a site, load one
extra stylesheet after the core stylesheet:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@troennes/minium@0.2.0/dist/minium.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@troennes/minium@0.2.0/dist/themes/blue.css">
```

This release also restyles secondary and tertiary buttons and removes most
drop shadows.

### Added

- **Color themes:** 31 opt-in themes in `dist/themes/`, one for each Radix
  Colors scale.
- **Theme package export:** Import a theme with
  `import "@troennes/minium/themes/blue.css";`.
- **Color roles:** Semantic color tokens now read from seven roles: `neutral`,
  `primary`, `accent`, `danger`, `success`, `warning`, and `info`. Role tokens
  use Radix step names, such as `--neutral-12` and `--primary-a5`. To write your
  own theme, redefine every step of a role in `@layer theme`.
- **Role text tokens:** `--<role>-text` sets the text color of a role, and
  `--<role>-inverse` sets the text color on its solid fill.
- **Input icon sizes:** Inputs with a leading icon, and `select` elements, now
  adjust their icon position and padding for the `.small` and `.large`
  modifiers.

### Changed

- **Breaking — layers:** Library tokens moved from `@layer theme` to
  `@layer tokens`. The `theme` layer now holds only theme files and your own
  overrides, so an override in `@layer theme` always wins over the defaults.
- **Breaking — palette tokens:** The bundle no longer defines Radix palette
  tokens such as `--sand-12`, `--orange-9`, or `--black-a7`. Use a semantic
  token (`--color-text`, `--color-primary`) or a role token (`--neutral-12`,
  `--primary-9`) instead. The full palette remains available in
  `reference/colors.css` in the repository; it is not published to npm.
- **Secondary buttons:** `.secondary` now uses a soft tinted fill with colored
  text and no border.
- **Tertiary buttons:** `.tertiary` now looks like a link: link color with an
  underline. Use a solid or `.secondary` button for actions that must stand out.
- **Shadows:** Buttons, badges, and form controls no longer have a drop shadow.
- **Warning inverse color:** `--color-warning-inverse` now follows the theme
  neutral instead of plain `black`.

### Fixed

- If a bundled font was installed locally, bold and italic text could render
  with the regular face. The `local()` sources now name the exact face instead
  of the family.
- The active tab indicator now overlaps the tab list border instead of sitting
  next to it.
- The track edge of `progress` and `meter` now blends with the fill.
- Search inputs place their icon on the correct side in right-to-left layouts.

### Upgrade from 0.1

1. Update the version in your CDN URL or run
   `npm install @troennes/minium@0.2.0`.
2. Search your CSS for Radix palette tokens, such as `--sand-` or `--orange-`.
   Replace each one with a semantic or role token. Without this change, those
   declarations resolve to nothing.
3. If you override tokens in `@layer theme`, no change is needed. Your
   overrides now win over the library defaults in every load order.

## [0.1.1] - 2026-08-25

### Fixed

- Minification stripped the descendant combinator before a pseudo-class, turning
  selectors such as `nav :is(ol, ul)` into `nav:is(ol, ul)`.

## [0.1.0] - 2026-08-15

Initial public release.

[0.3.0]: https://github.com/troennes/minium/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/troennes/minium/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/troennes/minium/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/troennes/minium/releases/tag/v0.1.0
