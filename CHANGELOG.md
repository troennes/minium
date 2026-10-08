# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.2.0]: https://github.com/troennes/minium/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/troennes/minium/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/troennes/minium/releases/tag/v0.1.0
