import type { createViewportManager } from './manager'

/**
 * Viewport manager instance.
 */
export type ViewportManager = ReturnType<typeof createViewportManager>

/**
 * Viewport options.
 */
export type ViewportOptions = {
  /**
   * Breakpoints.
   */
  breakpoints: {
    [key: string]: number
  }

  /**
   * Cookie name.
   *
   * Default: "viewport".
   */
  cookieName: string

  /**
   * Default breakpoints based on device type for auto detection.
   *
   * Available devices: "console", "desktop", "embedded", "mobile", "smarttv", "tablet", "wearable".
   */
  defaultBreakpoints: {
    [key: string]: string
  }

  /**
   * Fallback breakpoint.
   */
  fallbackBreakpoint: string
}

/**
 * Viewport query.
 */
export type ViewportQuery = {
  /**
   * CSS media query.
   */
  mediaQuery: string

  /**
   * Size.
   */
  size: number
}

// @ts-ignore
declare module 'vue/types/vue' {
  interface Vue {
    $viewport: ViewportManager
  }
}

// Nuxt Bridge & Nuxt 3
declare module '#app' {
  // eslint-disable-next-line no-use-before-define
  interface NuxtApp extends PluginInjection {}
}

interface PluginInjection {
  $viewport: ViewportManager
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends PluginInjection {}
}
