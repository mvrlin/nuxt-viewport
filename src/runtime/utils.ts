import type { IncomingHttpHeaders } from 'node:http'

import type { ViewportOptions } from './types'

import { DEFAULT_OPTIONS } from './constants'

export type DetectBreakpointInput = {
  cookie: string
  headers: IncomingHttpHeaders
}

const AMAZON_CLOUDFRONT_UA_TYPES: Record<string, string> = {
  'cloudfront-is-android-viewer': 'mobile',
  'cloudfront-is-desktop-viewer': 'desktop',
  'cloudfront-is-ios-viewer': 'mobile',
  'cloudfront-is-mobile-viewer': 'mobile',
  'cloudfront-is-smarttv-viewer': 'tv',
  'cloudfront-is-tablet-viewer': 'tablet',
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

    // Detect the device by headers.
    if (input.headers) {
      deviceType = getDeviceTypeFromHeaders(input.headers, userAgent)
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

function getDeviceTypeFromHeaders(headers: IncomingHttpHeaders, userAgent: string): string {
  // Client hints mobile.
  if (headers['sec-ch-ua-mobile'] === '?1') {
    return 'mobile'
  }

  // Amazon CloudFront.
  if (userAgent === 'Amazon CloudFront') {
    for (const key in AMAZON_CLOUDFRONT_UA_TYPES) {
      if (headers[key] === 'true') {
        return AMAZON_CLOUDFRONT_UA_TYPES[key]
      }
    }
  }

  // Cloudflare mobile viewer.
  if (headers['cloudfront-is-mobile-viewer'] === 'true') {
    return 'mobile'
  }

  // Cloudflare device type.
  if (headers['cf-device-type']) {
    return headers['cf-device-type'] as string
  }

  return ''
}
