import cookie from 'js-cookie'
import Vue from 'vue'

/**
 * Viewport module.
 */
export type ViewportModule = {
  /**
   * Current breakpoint.
   */
  readonly breakpoint: string

  /**
   * Returns true, if searchBreakpoint is strictly greater than the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  isGreaterThan: (searchBreakpoint: string) => Boolean

  /**
   * Returns true, if searchBreakpoint is greater or equals the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  isGreaterOrEquals: (searchBreakpoint: string) => Boolean

  /**
   * Returns true, if searchBreakpoint is less, than the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  isLessThan: (searchBreakpoint: string) => Boolean

  /**
   * Returns true if current breakpoint is matching the value.
   * @param breakpointToMatch - Breakpoint value to match.
   */
  match: (breakpointToMatch: string) => Boolean

  /**
   * Returns true if current breakpoint is included in the values.
   * @param breakpointsToMatch - Breakpoints to match.
   */
  matches: (...breakpointsToMatch: string[]) => Boolean
}

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

/**
 * Default options.
 * @const
 */
export const DEFAULT_OPTIONS: ViewportOptions = {
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
}

/**
 * Detects the breakpoint based on Cookie & User-Agent.
 */
export async function detectBreakpoint(this: ViewportOptions, cookie?: string, userAgent?: string) {
  try {
    if (cookie && cookie in this.breakpoints) {
      return cookie
    }

    // Import ua-parser-js chunk.
    const { default: UAParser } = await import(/* webpackChunkName: "ua-parser-js" */ 'ua-parser-js')
    const parser = new UAParser(userAgent)

    // Detect the device by User-Agent.
    const { type: deviceType = '' } = parser.getDevice()

    // If deviceType is included in the defaultBreakpoints, than use it.
    if (deviceType in this.defaultBreakpoints) {
      return this.defaultBreakpoints[deviceType]
    }

    return this.fallbackBreakpoint
  } catch (error) {
    console.error(error)
    return this.fallbackBreakpoint
  }
}

/**
 * Returns the viewport instance.
 */
export function useViewport(options: ViewportOptions, breakpoint: string) {
  const instance = new Vue({
    data() {
      return {
        breakpoint,
      }
    },

    computed: {
      /**
       * Array of queries.
       */
      _queries() {
        const { breakpoints = {} } = options
        const breakpointsKeys = Object.keys(breakpoints).sort((a, b) => breakpoints[a] - breakpoints[b])

        const queries: Record<string, ViewportQuery> = {}
        let i = breakpointsKeys.length

        while (i--) {
          const currentKey = breakpointsKeys[i]

          const size = breakpoints[currentKey]
          const nextSize = breakpoints[breakpointsKeys[i + 1]]

          let mediaQuery = ''

          if (i > 0) {
            mediaQuery = `(min-width: ${size}px)`
          } else {
            mediaQuery = `(min-width: 1px)`
          }

          if (nextSize) {
            mediaQuery += ` and (max-width: ${nextSize - 1}px)`
          }

          queries[currentKey] = {
            mediaQuery,
            size,
          }
        }

        return queries
      },
    },

    created() {
      if (process.server) {
        return
      }

      /* eslint-disable nuxt/no-globals-in-created */
      window.onNuxtReady(() => {
        for (const queryKey in this._queries) {
          const { mediaQuery } = this._queries[queryKey]
          const mediaQueryList = window.matchMedia(mediaQuery)

          if (mediaQueryList.matches) {
            this._setBreakpoint(queryKey)
          }

          mediaQueryList.onchange = (event) => {
            if (!event.matches) {
              return
            }

            this._setBreakpoint(queryKey)
          }
        }
      })
    },

    methods: {
      /**
       * Updates the breakpoint.
       * @param breakpoint - New breakpoint.
       */
      _setBreakpoint(breakpoint: string) {
        this.breakpoint = breakpoint

        cookie.set(options.cookieName, breakpoint, {
          expires: 365,
          sameSite: 'strict',
        })
      },

      /**
       * Returns true, if searchBreakpoint is strictly greater than the current breakpoint.
       * @param searchBreakpoint - Breakpoint to search.
       */
      isGreaterThan(searchBreakpoint: string) {
        const keys = Object.keys(this._queries)
        const currentIndex = keys.indexOf(this.breakpoint)

        const breakpointIndex = keys.indexOf(searchBreakpoint)

        if (breakpointIndex === -1) {
          return false
        }

        return breakpointIndex > currentIndex
      },

      /**
       * Returns true, if searchBreakpoint is greater or equals the current breakpoint.
       * @param searchBreakpoint - Breakpoint to search.
       */
      isGreaterOrEquals(searchBreakpoint: string) {
        return this.isGreaterThan(searchBreakpoint) || this.match(searchBreakpoint)
      },

      /**
       * Returns true, if searchBreakpoint is less, than the current breakpoint.
       * @param searchBreakpoint - Breakpoint to search.
       */
      isLessThan(searchBreakpoint: string) {
        const keys = Object.keys(this._queries)
        const currentIndex = keys.indexOf(this.breakpoint)

        const breakpointIndex = keys.indexOf(searchBreakpoint)

        if (breakpointIndex === -1) {
          return false
        }

        return breakpointIndex < currentIndex
      },

      /**
       * Returns true if current breakpoint is matching the value.
       * @param breakpointToMatch - Breakpoint value to match.
       */
      match(breakpointToMatch: string) {
        return this.breakpoint === breakpointToMatch
      },

      /**
       * Returns true if current breakpoint is included in the values.
       * @param breakpointsToMatch - Breakpoints to match.
       */
      matches(...breakpointsToMatch: string[]) {
        return breakpointsToMatch.includes(this.breakpoint)
      },
    },
  })

  return instance
}
