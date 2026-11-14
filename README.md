# Minium CSS

**The minimum CSS and HTML to build anything.**

Minium is a semantic-first CSS library that makes ordinary HTML look good, then adds class-light layouts and components for building real interfaces.

[See what it looks like](https://minium.style/examples/dashboard.html) | [Read the documentation](https://minium.style/docs/index.html)

## Why Minium?

Writing semantic HTML should get you further than an unstyled page.

With Minium, elements such as headings, links, tables, forms, buttons, `details`, and `dialog` work as the baseline. When the interface needs more structure, one meaningful class can add a layout or component. Utilities are there to adjust the result, not construct it one declaration at a time.

```html
<main class="container flow">
  <h1>Latest articles</h1>

  <section class="grid thirds">
    <article class="card">
      <h2>Write the HTML you mean</h2>
      <p>Semantic elements provide the foundation. Minium does the styling.</p>
      <a href="/articles/semantic-html" role="button">Read article</a>
    </article>
  </section>
</main>
```

The library takes on more CSS when it lets users write meaningfully less HTML. Features that do not pay back their bundle cost through real use do not belong.

## Quick start

Load the minified stylesheet from jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@troennes/minium@0.4.0/dist/minium.min.css">
```

Or install the package with npm:

```bash
npm install @troennes/minium
```

The [quick start guide](https://minium.style/docs/index.html) covers color themes, bundler imports, self-hosting, and building from source.

## Features

- **Semantic HTML first.** Common document, typography, table, form, and interactive elements look good without classes
- **Composable layout primitives.** Use `.container`, `.flow`, `.cluster`, `.grid`, `.sidebar`, `.switcher`, `.repel`, and `.frame` to express common compositions with one class
- **Common components.** Minium includes cards, alerts, modals, dropdowns, accordions, navigation, tabs, pagination, badges, avatars, skeletons, loading and progress states, and tooltips
- **Class-light by design.** Components own their structure and appearance, so meaningful classes replace wrapper stacks and utility chains
- **Accessible defaults.** Minium favors native elements and browser behavior, preserves visible focus states, styles semantic and ARIA states, and respects reduced-motion preferences
- **Customization.** Custom properties control color, type, spacing, radii, shadows, and density
- **Pure modern CSS.** There is no Sass, preprocessor, build-time configuration, or JavaScript dependency
- **MIT licensed.** Use Minium in personal, commercial, and open-source projects
- **RTL support.** Logical properties and targeted RTL rules let layouts and components follow the document direction
- **31 color themes.** One theme per Radix Color scale, each a 1.3–2.7 KB gzipped stylesheet with light and dark values and Display P3 colors for capable displays. Load one file to switch themes, with no build step
- **Light and dark modes.** Theme colors follow the system preference by default and can be explicitly set to light or dark
- **Responsive layouts.** Fluid type and spacing, intrinsic layouts, wrapping, and constrained components adapt to available space without a large breakpoint system
- **Small fixed bundle.** The current minified core is ~14.3 KiB gzipped, so its cost is predictable before you write any HTML
- **Token-bounded utilities.** Adjust spacing, gaps, radii, surfaces, and other common values without opening an unlimited utility API or reaching for inline styles
- **Cascade layers.** Library styles remain predictable, and project overrides stay straightforward
- **Opt-in integrations.** CSS for third-party markup ships separately from the core library
- **AI-readable reference.** [`llms.txt`](llms.txt) documents Minium's API and usage constraints in one place (~11k tokens)

## Documentation

- [Quick start](https://minium.style/docs/index.html)
- [Layouts](https://minium.style/docs/layout.html)
- [Components](https://minium.style/docs/component-accordion.html)
- [Forms](https://minium.style/docs/forms.html)
- [Utilities](https://minium.style/docs/utility.html)
- [Customization](https://minium.style/docs/customization.html)
- [Integrations](https://minium.style/docs/integrations.html)
- [Color palette](https://minium.style/docs/colors.html)
- [Complete AI-readable reference](https://minium.style/llms.txt)

The [dashboard example](https://minium.style/examples/dashboard.html) uses semantic HTML and Minium classes to build an application shell.

## Background

I built Minium because I was tired of bloated CSS frameworks, extra dependencies, and constant churn. I wanted modern CSS that makes semantic HTML look good, avoids short-lived design trends, and needs little maintenance.

I have worked on Minium on and off since 2022 and rebuilt it from scratch three times as its fundamental ideas evolved. [Pico](https://picocss.com) remains the main inspiration, alongside [CUBE CSS](https://cube.fyi/) and [Every Layout](https://every-layout.dev/).

After three rebuilds, Minium’s core ideas feel settled. It works well for the sites and interfaces I build. Broader use will help reveal what still needs work before version 1.0.

## Project status: 0.x

The library is ready to use, but it has not yet been tested across a wide range of websites, applications, and browsers. Expect breaking changes in minor releases before 1.0. The [changelog](CHANGELOG.md) lists each change and the steps to upgrade.

Please [open an issue](https://github.com/troennes/minium/issues) if you find rendering or accessibility problems, unclear documentation, awkward component boundaries, or APIs that require unnecessary HTML. Include a small reproduction and browser details when relevant.

## Browser support

Minium targets the current stable releases of Chrome, Firefox, and Safari. Other Chromium-based browsers (such as Edge) should also work, but are not tested directly.

## Development

Development requires Node.js 22 or later.

```bash
npm install
npm test              # lint + theme check + gzip size budget
npm run build         # build core CSS, minified CSS, fonts and themes
npm run build:themes  # regenerate color roles and themes from scripts/themes.json
```

## License

Minium is available under the [MIT License](https://github.com/troennes/minium/blob/main/LICENSE).

## About the name

Minium is the historical name for red lead, an orange-red pigment. An unrelated CSS project also used the same name in 2018; this is a separate project.
