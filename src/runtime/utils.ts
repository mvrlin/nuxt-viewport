import type { ViewportOptions } from '../runtime/types'

export async function detectBreakpoint(this: ViewportOptions, cookie?: string, userAgent?: string) {
  try {
    if (cookie && cookie in this.breakpoints) {
      return cookie
    }

    if (!userAgent) {
      return this.fallbackBreakpoint
    }

    // Import bowser chunk.
    const { default: Bowser } = await import(/* webpackChunkName: "bowser" */ 'bowser')
    const parser = Bowser.getParser(userAgent)

    // Detect the device by User-Agent.
    const deviceType = parser.getPlatformType()

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

export function parseCookie(input: string): Record<string, string> {
  if (!input.length) {
    return {}
  }

  return Object.fromEntries(input.split(/; */).map((cookie) => cookie.split('=', 2)))
}
