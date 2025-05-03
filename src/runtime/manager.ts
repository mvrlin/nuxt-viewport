import cookie from 'cookiejs'
import { computed, type MaybeRefOrGetter, type Ref, toRef, toValue } from 'vue-demi'

import type { ViewportOptions, ViewportQuery } from './types'

export const STATE_KEY = 'viewportState'

export function createViewportManager(options: MaybeRefOrGetter<ViewportOptions>, state: Ref<string>) {
  options = toRef(options)

  const breakpoint = computed<string>({
    get() {
      return state.value || options.value.fallbackBreakpoint
    },

    set(newBreakpoint) {
      state.value = newBreakpoint

      if (typeof window !== 'undefined' && options.value.cookie.name) {
        cookie.set(options.value.cookie.name, state.value, options.value.cookie)
      }
    },
  })

  const queries = computed<Record<string, ViewportQuery>>(() => {
    // Fix an odd rendering glitch with specific operating system UI scaling,
    // and combined with specific viewport sizes.
    const delta = 0.02

    const breakpoints = options.value.breakpoints || {}
    const breakpointsKeys = Object.keys(breakpoints).sort((a, b) => breakpoints[a] - breakpoints[b])

    const output: Record<string, ViewportQuery> = {}
    let i = breakpointsKeys.length

    while (i--) {
      const currentKey = breakpointsKeys[i]

      const size = breakpoints[currentKey]
      const nextSize = breakpoints[breakpointsKeys[i + 1]]
      const prevSize = breakpoints[breakpointsKeys[i - 1]]

      let mediaQuery = ''

      if (options.value.feature === 'minWidth') {
        if (i > 0) {
          mediaQuery = `(min-width: ${size}px)`
        } else {
          mediaQuery = '(min-width: 1px)'
        }

        if (nextSize) {
          mediaQuery += ` and (max-width: ${nextSize - delta}px)`
        }
      } else {
        mediaQuery = `(max-width: ${size}px)`

        if (prevSize) {
          mediaQuery = `(min-width: ${prevSize + delta}px) and ${mediaQuery}`
        }
      }

      output[currentKey] = {
        mediaQuery,
        size,
      }
    }

    return output
  })

  const queriesKeys = computed(() => Object.keys(queries.value))

  return {
    breakpoint,
    breakpointValue,

    isGreaterThan,
    isGreaterOrEquals,

    isLessThan,
    isLessOrEquals,

    match,
    matches,

    queries,
  }

  /**
   * Returns breakpoint size from breakpoint name.
   * @param searchBreakpoint - Breakpoint to search.
   */
  function breakpointValue(searchBreakpoint: string) {
    const breakpoints = toValue(options).breakpoints || {}

    return breakpoints[searchBreakpoint]
  }

  /**
   * Returns true, if searchBreakpoint is strictly greater than the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  function isGreaterThan(searchBreakpoint: string) {
    const currentIndex = queriesKeys.value.indexOf(breakpoint.value)
    const breakpointIndex = queriesKeys.value.indexOf(searchBreakpoint)

    if (breakpointIndex === -1) {
      return false
    }

    return breakpointIndex > currentIndex
  }

  /**
   * Returns true, if searchBreakpoint is greater or equals the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  function isGreaterOrEquals(searchBreakpoint: string) {
    return isGreaterThan(searchBreakpoint) || match(searchBreakpoint)
  }

  /**
   * Returns true, if searchBreakpoint is less, than the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  function isLessThan(searchBreakpoint: string) {
    const currentIndex = queriesKeys.value.indexOf(breakpoint.value)
    const breakpointIndex = queriesKeys.value.indexOf(searchBreakpoint)

    if (breakpointIndex === -1) {
      return false
    }

    return breakpointIndex < currentIndex
  }

  /**
   * Returns true, if searchBreakpoint is less or equals the current breakpoint.
   * @param searchBreakpoint - Breakpoint to search.
   */
  function isLessOrEquals(searchBreakpoint: string) {
    return isLessThan(searchBreakpoint) || match(searchBreakpoint)
  }

  /**
   * Returns true if current breakpoint is matching the value.
   * @param breakpointToMatch - Breakpoint value to match.
   */
  function match(breakpointToMatch: string) {
    return breakpoint.value === breakpointToMatch
  }

  /**
   * Returns true if current breakpoint is included in the values.
   * @param breakpointsToMatch - Breakpoints to match.
   */
  function matches(...breakpointsToMatch: string[]) {
    return breakpointsToMatch.includes(breakpoint.value)
  }
}
