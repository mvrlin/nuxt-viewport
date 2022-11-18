# nuxt-viewport

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> Define custom viewports for your [Nuxt](https://v3.nuxtjs.org/)️ project

## Features

- ⚡️&nbsp; Fast & Light with [MatchMedia API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) ⚡️
- 🕶&nbsp; Auto detects the device viewport from Cookie & User-Agent
- 👌&nbsp; Zero configuration to start
- 👴️&nbsp; Supports IE9+

> **Note**\
> This version is Nuxt 3 & Nuxt Bridge only. For Nuxt 2 see [1.0.1](https://www.npmjs.com/package/nuxt-viewport/v/1.0.1)

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

## Usage
```vue
<script setup>
import { useNuxtApp } from '#app'
const { $viewport } = useNuxtApp()

watch($viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
  console.log('Breakpoint updated:', oldBreakpoint, '->', newBreakpoint)
})
</script>

<template>
  <div>
    <div v-if="$viewport.isLessThan('tablet')">Should render only on mobile</div>
    <div v-else>Current breakpoint: {{ $viewport.breakpoint }}</div>
  </div>
</template>
```

## Usage with composable
```vue
<script setup>
const viewport = useViewport()

watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
  console.log('Breakpoint updated:', oldBreakpoint, '->', newBreakpoint)
})
</script>

<template>
  <div>
    <div v-if="viewport.isLessThan('tablet')">Should render only on mobile</div>
    <div v-else>Current breakpoint: {{ viewport.breakpoint }}</div>
  </div>
</template>
```

## Usage with "@nuxt/bridge"
```vue
<script setup>
const viewport = useViewport()

watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
  console.log('Breakpoint updated:', oldBreakpoint, '->', newBreakpoint)
})
</script>

<template>
  <div>
    <div v-if="viewport.isLessThan('tablet')">Should render only on mobile</div>
    <div v-else>Current breakpoint: {{ $viewport.breakpoint }}</div>
  </div>
</template>
```

## Configuration

### `breakpoints`

- Type: Object

An object where the key is the name of the viewport, and the value is the viewport size.

### `cookieName`

- Type: String
- Default: `viewport`

The key for the document cookie.

### `defaultBreakpoints`

- Type: Object
- Detectable devices: `console`, `desktop`, `embedded`, `mobile`, `smarttv`, `tablet`, `wearable`

An object where the key is the name of the detected device, and the value is the breakpoint key.

### `fallbackBreakpoint`

- Type: String
- Default: `viewport`

The breakpoint key to be used, if the device was not detected.

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

## Example configuration for Tailwind CSS
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

## API

### `viewport.breakpoint`
- Type: String

Current breakpoint.

### `viewport.isGreaterThan`
- Type: Boolean

```js
// Example: viewport.breakpoint is "mobile".

viewport.isGreaterThan('mobile') // Result: false.
viewport.isGreaterThan('desktop') // Result: false.
```

### `viewport.isGreaterOrEquals`
- Type: Boolean

```js
// Example: viewport.breakpoint is "mobile".

viewport.isGreaterOrEquals('mobile') // Result: true.
viewport.isGreaterOrEquals('desktop') // Result: false.
```

### `viewport.isLessThan`
- Type: Boolean

```js
// Example: viewport.breakpoint is "desktop".

viewport.isLessThan('desktopWide') // Result: true.
viewport.isLessThan('mobile') // Result: false.
```

### `viewport.match`
- Type: Boolean

```js
// Example: viewport.breakpoint is "tablet".

viewport.match('tablet') // Result: true.
viewport.match('desktop') // Result: false.
```

### `viewport.matches`
- Type: Boolean

```js
// Example: viewport.breakpoint is "mobileWide".

viewport.matches('tablet', 'mobileWide') // Result: true.
viewport.matches('mobile', 'tablet') // Result: false.
```

### `viewport.queries`
- Type: Object

Object with generated media queries.

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
[npm-version-src]: https://img.shields.io/npm/v/nuxt-viewport/latest.svg?style=for-the-badge
[npm-version-href]: https://npmjs.com/package/nuxt-viewport

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-viewport.svg?style=for-the-badge
[npm-downloads-href]: https://npmjs.com/package/nuxt-viewport

[license-src]: https://img.shields.io/npm/l/nuxt-viewport.svg?style=for-the-badge
[license-href]: https://npmjs.com/package/nuxt-viewport
