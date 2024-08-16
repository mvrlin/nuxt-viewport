import type { CookieOptions } from 'cookiejs'
import type { createViewportManager } from './runtime/manager'

/**
 * Viewport cookie options.
 */
export type ViewportCookie = CookieOptions & {
  name?: string
}

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
  breakpoints: Record<string, number>

  /**
   * Cookie options.
   */
  cookie: ViewportCookie

  /**
   * Default breakpoints based on device type for auto detection.
   *
   * Available devices: "bot", "desktop", "mobile", "tablet", "tv".
   */
  defaultBreakpoints: Record<string, string>

  /**
   * Fallback breakpoint.
   */
  fallbackBreakpoint: string

  /**
   * CSS media feature.
   */
  feature: 'minWidth' | 'maxWidth'
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

declare module 'vue' {
  interface ComponentCustomProperties extends PluginInjection {}
}
