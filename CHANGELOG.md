# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-08-25

### Fixed

- Minification stripped the descendant combinator before a pseudo-class, turning
  selectors such as `nav :is(ol, ul)` into `nav:is(ol, ul)`.

## [0.1.0] - 2026-08-15

Initial public release.

[0.1.1]: https://github.com/troennes/minium/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/troennes/minium/releases/tag/v0.1.0
