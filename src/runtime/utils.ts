import type { ViewportOptions } from '../runtime/types'

export type DetectBreakpointInput = {
  cookie: string
  userAgent: string
}

export async function detectBreakpoint(options: ViewportOptions, input: Partial<DetectBreakpointInput>) {
  try {
    if (input.cookie && input.cookie in options.breakpoints) {
      return input.cookie
    }

    if (!input.userAgent) {
      return options.fallbackBreakpoint
    }

    // Import bowser chunk.
    const { default: Bowser } = await import(/* webpackChunkName: "bowser" */ 'bowser')
    const parser = Bowser.getParser(input.userAgent)

    // Detect the device by User-Agent.
    const deviceType = parser.getPlatformType()

    // If deviceType is included in the defaultBreakpoints, than use it.
    if (deviceType in options.defaultBreakpoints) {
      return options.defaultBreakpoints[deviceType]
    }

    return options.fallbackBreakpoint
  } catch (error) {
    console.error(error)
    return options.fallbackBreakpoint
  }
}

export function parseCookie(input: string): Record<string, string> {
  if (!input.length) {
    return {}
  }

  return Object.fromEntries(input.split(/; */).map((cookie) => cookie.split('=', 2)))
}
