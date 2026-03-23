import Bowser from 'bowser'
import type { H3Event } from 'h3'

export interface ClientHintsOptions {
  viewportWidth?: boolean
  critical?: boolean
}

export interface ViewportOptions {
  cookie?: boolean
  clientHints?: boolean | ClientHintsOptions
  fallback?: string
}

export function getViewportFromCookie(event: H3Event) {
  const cookie = event.node.req.headers.cookie
  if (!cookie) { return }

  const match = cookie.match(/viewport=([^;]+)/)
  return match?.[1]
}

export function getViewportFromClientHints(event: H3Event, options?: boolean | ClientHintsOptions) {
  if (!options) { return }

  const headers = event.node.req.headers

  // 1. Mobile hint (primary signal)
  const mobile = headers['sec-ch-ua-mobile']
  if (typeof mobile === 'string') {
    if (mobile.includes('?1')) { return 'mobile' }
    if (mobile.includes('?0')) { return 'desktop' }
  }

  // 2. Viewport width hint (optional)
  const opts = typeof options === 'object' ? options : {}
  if (opts.viewportWidth) {
    const width = headers['sec-ch-viewport-width']
    if (typeof width === 'string') {
      const parsed = parseInt(width, 10)
      if (!isNaN(parsed)) {
        return parsed < 768 ? 'mobile' : 'desktop'
      }
    }
  }
}

export function getViewportFromHeaders(event: H3Event) {
  const headers = event.node.req.headers

  // CloudFront headers
  const cf = headers['cloudfront-is-mobile-viewer']
  if (cf === 'true') { return 'mobile' }
  if (cf === 'false') { return 'desktop' }

  // Cloudflare headers
  const cfd = headers['cf-device-type']
  if (typeof cfd === 'string') {
    if (cfd === 'mobile') { return 'mobile' }
    if (cfd === 'desktop') { return 'desktop' }
    if (cfd === 'tablet') { return 'tablet' }
  }
}

export function getViewportFromUserAgent(event: H3Event) {
  const ua = event.node.req.headers['user-agent']
  if (!ua) { return }

  const parser = Bowser.getParser(ua)
  const platform = parser.getPlatformType(true)

  if (platform === 'mobile') { return 'mobile' }
  if (platform === 'tablet') { return 'tablet' }
  return 'desktop'
}

export function resolveViewport(event: H3Event, options: ViewportOptions = {}) {
  // PRIORITY (as described in the issue):
  // cookie → client hints → CDN headers → user agent → fallback

  const fromCookie = options.cookie !== false && getViewportFromCookie(event)
  if (fromCookie) { return fromCookie }

  const fromCH = getViewportFromClientHints(event, options.clientHints)
  if (fromCH) { return fromCH }

  const fromHeaders = getViewportFromHeaders(event)
  if (fromHeaders) { return fromHeaders }

  const fromUA = getViewportFromUserAgent(event)
  if (fromUA) { return fromUA }

  return options.fallback || 'desktop'
}
