import type { Module } from '@nuxt/types'

import type { ViewportModule, ViewportOptions } from './runtime/viewport'
import { DEFAULT_OPTIONS } from './runtime/viewport'

/**
 * Nuxt module.
 */
type NuxtModule<T> = Module<T> & {
  meta: unknown
}

const nuxtModule: NuxtModule<ViewportOptions> = function (customOptions) {
  const { nuxt } = this

  const options = {
    ...DEFAULT_OPTIONS,
    ...(customOptions || this.options.viewport || {}),
  }

  this.addPlugin({
    filename: 'viewport.client.js',

    options,
    src: require.resolve('./runtime/plugin.client'),
  })

  this.addPlugin({
    filename: 'viewport.server.js',

    options,
    src: require.resolve('./runtime/plugin.server'),
  })

  nuxt.options.alias['~viewport'] = require.resolve('./runtime/viewport')
  nuxt.options.build.transpile.push(__dirname, 'nuxt-viewport')
}

// Assign the module meta.
nuxtModule.meta = require('../package.json')

export default nuxtModule

declare module 'vue/types/vue' {
  interface Vue {
    $viewport: ViewportModule
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $viewport: ViewportModule
  }
  interface NuxtAppOptions {
    $viewport: ViewportModule
  }
}

// Nuxt 2.9+
declare module '@nuxt/types' {
  interface Context {
    $viewport: ViewportModule
  }
  interface NuxtAppOptions {
    $viewport: ViewportModule
  }
}

declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    viewport: ViewportOptions
  }
}
