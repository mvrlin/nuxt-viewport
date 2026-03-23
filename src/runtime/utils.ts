import type { IncomingHttpHeaders } from 'node:http'

import type { ViewportOptions } from './types'

import { DEFAULT_OPTIONS } from './constants'

export type DetectBreakpointInput = {
  cookie: string
  headers: IncomingHttpHeaders
}

export async function detectBreakpoint(options: ViewportOptions, input: Partial<DetectBreakpointInput>) {
  try {
    if (input.cookie && input.cookie in options.breakpoints) {
      return input.cookie
    }

    const userAgent = input.headers?.['user-agent']
    if (!userAgent) {
      return options.fallbackBreakpoint
    }

    let deviceType = ''

    // Detect the device by Client Hints.
    if (options.clientHints && input.headers) {
      const hintsOptions = typeof options.clientHints === 'object' ? options.clientHints : {}

      // Sec-CH-Viewport-Width gives pixel-accurate detection.
      if (hintsOptions.viewportWidth) {
        const viewportWidth = input.headers['sec-ch-viewport-width']

        if (viewportWidth) {
          const width = Number(viewportWidth)

          if (!Number.isNaN(width) && width > 0) {
            const breakpoint = resolveBreakpointFromWidth(options, width)

            if (breakpoint) {
              return breakpoint
            }
          }
        }
      }

      // Sec-CH-UA-Mobile is sent by default on Chromium (no Accept-CH needed).
      const uaMobile = input.headers['sec-ch-ua-mobile']

      if (uaMobile === '?1' && 'mobile' in options.defaultBreakpoints) {
        return options.defaultBreakpoints.mobile
      }
    }

    // Detect the device by headers.
    if (input.headers) {
      // Amazon CloudFront.
      if (userAgent === 'Amazon CloudFront') {
        const types: Record<string, string> = {
          'cloudfront-is-android-viewer': 'mobile',
          'cloudfront-is-desktop-viewer': 'desktop',
          'cloudfront-is-ios-viewer': 'mobile',
          'cloudfront-is-mobile-viewer': 'mobile',
          'cloudfront-is-smarttv-viewer': 'tv',
          'cloudfront-is-tablet-viewer': 'tablet',
        }

        for (const key in types) {
          if (input.headers[key] === 'true') {
            deviceType = types[key]
            break
          }
        }

        // Cloudflare.
      }
      else if (input.headers['cf-device-type']) {
        deviceType = input.headers['cf-device-type'] as string
      }
    }

    // Detect the device by User-Agent.
    if (!deviceType) {
      // Import bowser chunk.
      const { default: Bowser } = await import(/* webpackChunkName: "bowser" */ 'bowser')
      const parser = Bowser.getParser(userAgent)

      deviceType = parser.getPlatformType()
    }

    // If deviceType is included in the defaultBreakpoints, than use it.
    if (deviceType in options.defaultBreakpoints) {
      return options.defaultBreakpoints[deviceType]
    }

    return options.fallbackBreakpoint
  }
  catch (error) {
    console.error(error)
    return options.fallbackBreakpoint
  }
}

export function extendOptions(
  options: Partial<ViewportOptions> = {},
  extendFrom: ViewportOptions = DEFAULT_OPTIONS,
): ViewportOptions {
  return {
    ...extendFrom,
    ...options,

    cookie: {
      ...extendFrom.cookie,
      ...options.cookie,
    },
  }
}

export function parseCookie(input: string): Record<string, string> {
  if (!input.length) {
    return {}
  }

  return Object.fromEntries(input.split(/; */).map(cookie => cookie.split('=', 2)))
}

export function resolveBreakpointFromWidth(options: ViewportOptions, width: number): string | undefined {
  const entries = Object.entries(options.breakpoints).sort((a, b) => a[1] - b[1])

  if (!entries.length) {
    return undefined
  }

  if (options.feature === 'minWidth') {
    // Find the largest breakpoint value <= width (first breakpoint catches anything >= 1px)
    if (width >= 1) {
      for (let i = entries.length - 1; i >= 0; i--) {
        if (width >= entries[i][1] || i === 0) {
          return entries[i][0]
        }
      }
    }
  }
  else {
    // Find the smallest breakpoint value >= width
    for (const [name, size] of entries) {
      if (width <= size) {
        return name
      }
    }
  }

  return undefined
}
