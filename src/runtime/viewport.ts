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
   * Returns true, if searchBreakpoint is greater, than the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  isGreaterThan: (searchBreakpoint: string) => Boolean

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

  defaultBreakpoints: {
    desktop: 'desktop',
    mobile: 'mobile',
    tablet: 'tablet',
  },

  fallbackBreakpoint: 'desktop',
}

/**
 * Viewport cookie.
 * @const
 */
export const VIEWPORT_COOKIE = 'viewport'

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
        const entries = Object.keys(breakpoints).sort((a, b) => breakpoints[a] - breakpoints[b])

        return entries.reduceRight((acc: { [key: string]: ViewportQuery }, ref, index, array) => {
          const size = breakpoints[ref]
          const nextSize = breakpoints[array[index + 1]]

          let mediaQuery = ''

          if (index > 0) {
            mediaQuery = `(min-width: ${size}px)`
          } else {
            mediaQuery = `(min-width: 1px)`
          }

          if (nextSize) {
            mediaQuery += ` and (max-width: ${nextSize - 1}px)`
          }

          acc[ref] = {
            mediaQuery,
            size,
          }

          return acc
        }, {})
      },

      /**
       * Returns true, if searchBreakpoint is greater, than the current breakpoint.
       * @param searchBreakpoint - Breakpoint to search.
       */
      isGreaterThan() {
        const keys = Object.keys(this._queries)
        const currentIndex = keys.indexOf(this.breakpoint)

        return (searchBreakpoint: string) => {
          const breakpointIndex = keys.indexOf(searchBreakpoint)

          if (breakpointIndex === -1) {
            return false
          }

          return breakpointIndex > currentIndex
        }
      },

      /**
       * Returns true, if searchBreakpoint is less, than the current breakpoint.
       * @param searchBreakpoint - Breakpoint to search.
       */
      isLessThan() {
        const keys = Object.keys(this._queries)
        const currentIndex = keys.indexOf(this.breakpoint)

        return (searchBreakpoint: string) => {
          const breakpointIndex = keys.indexOf(searchBreakpoint)

          if (breakpointIndex === -1) {
            return false
          }

          return breakpointIndex < currentIndex
        }
      },

      /**
       * Returns true if current breakpoint is matching the value.
       * @param breakpointToMatch - Breakpoint value to match.
       */
      match() {
        return (breakpointToMatch: string) => {
          return this.breakpoint === breakpointToMatch
        }
      },

      /**
       * Returns true if current breakpoint is included in the values.
       * @param breakpointsToMatch - Breakpoints to match.
       */
      matches() {
        return (...breakpointsToMatch: string[]) => {
          return breakpointsToMatch.includes(this.breakpoint)
        }
      },
    },

    watch: {
      _queries: {
        deep: true,

        handler(queries: { [key: string]: ViewportQuery }) {
          if (process.server) {
            return
          }

          // Get queries keys.
          const queriesKeys = Object.keys(queries)

          if (!queriesKeys.length) {
            return
          }

          // Create an array of MediaQueryList.
          const mediaQueryLists = queriesKeys.map((key) => window.matchMedia(queries[key].mediaQuery))

          // Loop over mediaQueryLists and watch for changes.
          return mediaQueryLists.forEach((mediaQueryList, key) => {
            const newBreakpoint = queriesKeys[key]

            if (mediaQueryList.matches) {
              this._setBreakpoint(newBreakpoint)
            }

            mediaQueryList.addEventListener('change', (event) => {
              if (!event.matches) {
                return
              }

              this._setBreakpoint(newBreakpoint)
            })
          })
        },

        immediate: true,
      },
    },

    methods: {
      /**
       * Updates the breakpoint.
       * @param breakpoint - New breakpoint.
       */
      _setBreakpoint(breakpoint: string) {
        this.breakpoint = breakpoint

        cookie.set(VIEWPORT_COOKIE, breakpoint, {
          expires: 365,
          sameSite: 'strict',
        })
      },
    },
  })

  return instance
}
