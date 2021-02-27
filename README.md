# nuxt-viewport

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Define custom viewports for your [Nuxt](https://nuxtjs.org)️ project

## Features

- ⚡️&nbsp; Fast & Light with [MatchMedia API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) ⚡️
- 🕶&nbsp; Auto detects the device viewport from Cookie & User-Agent
- 👌&nbsp; Zero configuration to start
- 👴️&nbsp; Supports IE9+

## Quick Setup

1. Add `nuxt-viewport` dependency to your project

```bash
# Using npm
npm install --save-dev nuxt-viewport
# Using yarn
yarn add --dev nuxt-viewport
```

2. Add `nuxt-viewport` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    [
      'nuxt-viewport', {
        /* Viewport options */
      }
    ],
  ]
}
```

using top level options

```js
{
  modules: [
    'nuxt-viewport',
  ],

  viewport: {
    /* Viewport options */
  },
}
```

## Configuration

```ts
{
  // ...
  viewport: {
    // Define your own breakpoints.
    breakpoints: {
      [key: string]: number
    },

    // Cookie name.
    // Default: "viewport".
    cookieName: string

    // Default breakpoints based on device type for auto detection.
    // Available devices: "console", "desktop", "embedded", "mobile", "smarttv", "tablet", "wearable".
    defaultBreakpoints: {
      [key: string]: string
    },

    // Breakpoint to fallback, if device was not detected.
    fallbackBreakpoint: string
  },
  // ...
}
```

Example for TailwindCSS.
```js
{
  // ...
  viewport: {
    breakpoints: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },

    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'xs',
      tablet: 'md',
    },

    fallbackBreakpoint: 'lg'
  },
  // ...
}
```

## Default configuration

```js
{
  // ...
  viewport: {
    breakpoints: {
      desktop: 1024,
      desktopMedium: 1280,
      desktopWide: 1600,

      mobile: 320,
      mobileMedium: 375,
      mobileWide: 425,

      tablet: 768,
    },

    cookieName: 'viewport',

    defaultBreakpoints: {
      desktop: 'desktop',
      mobile: 'mobile',
      tablet: 'tablet',
    },

    fallbackBreakpoint: 'desktop',
  },
  // ...
}
```

## Typescript
If using typescript or running typescript language server to check the code (for example through Vetur), add types to `types` array in your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": [
      "@nuxt/types",
      "nuxt-viewport",
    ]
  }
}
```

## API

- `$viewport.breakpoint` - Current breakpoint.

- `$viewport.isGreaterThan(searchBreakpoint)` - Returns true, if searchBreakpoint is greater, than the current breakpoint.

- `$viewport.isLessThan(searchBreakpoint)` - Returns true, if searchBreakpoint is less, than the current breakpoint.

- `$viewport.match(breakpointToMatch)` - Returns true if current breakpoint is matching the value.

- `$viewport.matches(breakpointsToMatch)` - Returns true if current breakpoint is included in the values.

## Contributing

You can contribute to this module online with CodeSandBox:

[![Edit nuxt-viewport](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/mvrlin/nuxt-viewport/tree/main/?fontsize=14&hidenavigation=1&theme=dark)

Or locally:

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `yarn dev` or `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) mvrlin mvrlin@pm.me

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-viewport/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-viewport

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-viewport.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-viewport

[github-actions-ci-src]: https://github.com/mvrlin/nuxt-viewport/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/mvrlin/nuxt-viewport/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/mvrlin/nuxt-viewport.svg
[codecov-href]: https://codecov.io/gh/mvrlin/nuxt-viewport

[license-src]: https://img.shields.io/npm/l/nuxt-viewport.svg
[license-href]: https://npmjs.com/package/nuxt-viewport
