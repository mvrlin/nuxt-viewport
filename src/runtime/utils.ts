import type { ViewportOptions } from '../runtime/types'

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

export function parseCookie(input: string): Record<string, string> {
  if (!input.length) {
    return {}
  }

  return Object.fromEntries(input.split(/; */).map((cookie) => cookie.split('=', 2)))
}
