# Repository Guidelines

## North Star
Minium: the minimum CSS and HTML to build anything.

When those two pull in opposite directions, the library takes the cost — more CSS in the library so users write less HTML. Anything that doesn't pay back that cost in actual use doesn't belong.

Operating principles:
- Semantic HTML is the baseline; classes add capability, not requirement.
- Components are the primary building block; utilities adjust, not construct.
- Utilities are token-bounded (e.g. `gap-l`, `p-m`, `radius-s`) and preferred over `style="--var: ..."`.
- Size and density modifiers are component-scoped (e.g. `.button.small`), not global.
- Project-specific blocks go in `@layer project`, not in the library.

## Project Structure & Module Organization
- `css/colors.css`: full Radix palette, no longer bundled; moves to `reference/colors.css` in step 2 of `docs/themes-plan.md`.
- `css/theme.css`: layer order statement and library tokens in `@layer tokens` (type scale, flow spacing, semantic colors mapped to color roles).
- `css/roles.css`: default theme's color role values (`--neutral-*`, `--primary-*`, …) in `@layer tokens`.
- `css/reset.css`: foundational reset rules in `@layer reset` (box model, defaults, accessibility-focused baselines).
- `css/base.css` and `css/typography.css`: base layer defaults (`@layer base`), including typography and semantic flow defaults.
- `css/layout.css`: layout primitives and explicit flow utility (`@layer layout`).
- `css/components-<component-name>.css`: component patterns (`@layer components`).
- `css/utilities.css`: opt-in utility classes (`@layer utilities`).
- `project_plan.md`: product and architecture direction for the library (semantic defaults + CUBE-inspired composition).
- `tests/testbench`: one HTML file with all components, their usage and edge cases
- Keep new CSS modules in `css/` and name by responsibility (for example: `layout.css`, `components.css`, `typography.css`).
- `docs/`: Project documentation

## Build, Test, and Development Commands
- `npm run build`: build production CSS to `dist/` (`minium.css`, `minium.min.css`) and copy fonts to `dist/fonts`.
- `wc -c css/*.css`: quick size check to keep the library lightweight.
- `rg --line-number "@layer|--" css`: inspect layer usage and custom-property definitions.
- `npm run test:lint`: run stylelint on `css/**/*.css`.
- `npx stylelint "css/**/*.css" --fix`: auto-fix lint issues where possible.
- `npm run test:size`: check gzipped CSS size budget.
- `npm test`: run full checks (lint + size).

## Coding Style & Naming Conventions
- Use modern, plain CSS only (no Sass/Less).
- Use cascade layers (`@layer tokens, reset, ...`) to control specificity, so project-level overrides stay simple.
- Use custom properties as the primary API: `--token-name` and `var(--token-name, fallback)`.
- Keep formatting consistent with existing files: two-space indentation, grouped declarations, and short section comments when needed.
- Name files and classes by intent, not by presentation (for example, `layout-stack`, `component-card`, not `blue-box`).
- Use CSS nesting (similar to Sass, but in pure CSS)

## Vertical Flow Policy
- Default vertical rhythm should be semantic-first: apply auto-flow to classless semantic containers (`main`, `article`, `section`) in `@layer base`.
- Use text-relative flow spacing tokens (`em`-based) for prose rhythm so spacing scales with text size.
- Do not use blanket wrapper selectors like `> div > * + *` globally; they can break layout wrappers (for example: grids, clusters, containers).
- If wrapper support is needed, only target classless wrappers (`div:not([class])`) inside classless semantic containers.
- Classed wrappers (`.container`, `.grid`, etc.) should not receive automatic flow by default; flow must be explicit via a `.flow` utility in `@layer layout`.
- Provide an opt-out/escape hatch for explicit flow containers when needed (for example a data attribute that disables child spacing).

## Testing Guidelines
- No automated test framework is configured yet.
- Validate changes with a minimal HTML fixture that exercises typography, links, form controls, and components.
- For each PR, test in at least one Chromium-based browser and Firefox, and verify both light/dark token behavior where applicable.

## Documentation Sync Policy
- Any CSS content change that introduces a user-relevant API change must also update the relevant files in `docs/` and `llms.txt` in the same change.
- Treat as an API change anything users must keep in mind: new or removed classes, tokens, components, variants, required markup patterns, behavior changes, or usage constraints.
- Fixes and internal refactors that do not change the user-facing API do not require updates to `docs/` or `llms.txt`.

## Commit & Pull Request Guidelines
- Use Conventional Commits for all new commits.
- Preferred commit format: `type(scope): short summary`.
- Allowed commit types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`.
- Example: `feat(tokens): add neutral surface aliases`.
- PRs should include:
  - clear purpose and scope,
  - before/after screenshots for visual changes,
  - test status summary for `npm run test:lint`, `npm run test:size`, and visual checks,
  - note any intentionally skipped or failing checks with reason,
  - notes on token/API changes and any migration impact.

## Collaboration Agreement
- You (the human) will create the initial CSS code.
- I (the agent) will review it against project rules and suggest improvements.
- I (the agent) will not generate implementation code until you ask for that explicitly.
