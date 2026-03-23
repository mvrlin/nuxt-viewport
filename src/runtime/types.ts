import type { CookieOptions } from 'cookiejs'

import type { createViewportManager } from './manager'

/**
 * Viewport cookie options.
 */
export type ViewportCookie = {
  name?: string
} & CookieOptions

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
   * Enable HTTP Client Hints for improved cold-start detection.
   *
   * When `true`, uses `Sec-CH-UA-Mobile` (sent by default on Chromium).
   * Pass an object to also request `Sec-CH-Viewport-Width` for pixel-accurate detection.
   */
  clientHints?: boolean | ClientHintsOptions

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
  feature: 'maxWidth' | 'minWidth'
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

// @ts-expect-error override Vue interface
declare module 'vue/types/vue' {
  interface Vue {
    $viewport: ViewportManager
  }
}

// Nuxt Bridge & Nuxt 3
declare module '#app' {

  interface NuxtApp extends PluginInjection {}

  interface PageMeta {
    viewport?: Partial<ViewportOptions>
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    viewport?: Partial<ViewportOptions>
  }
}

/**
 * Client Hints options.
 */
export type ClientHintsOptions = {
  /**
   * Set Critical-CH header so the browser retries the request with hints if missing.
   */
  critical?: boolean

  /**
   * Request Sec-CH-Viewport-Width from the browser via Accept-CH response header.
   */
  viewportWidth?: boolean
}

interface PluginInjection {
  $viewport: ViewportManager
}

declare module 'vue' {
  interface ComponentCustomProperties extends PluginInjection {}
}
