import cookie from 'js-cookie'
import { detectBreakpoint, useViewport } from '~viewport'

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default async function ({ nuxtState }, inject) {
  const options = <%= serialize(options) %>
  let breakpoint

  if (nuxtState.viewport) {
    breakpoint = nuxtState.viewport
  } else {
    const viewportCookie = cookie.get(options.cookieName)
    breakpoint = await detectBreakpoint.call(options, viewportCookie, navigator.userAgent)
  }

  const viewport = useViewport(options, breakpoint)
  inject('viewport', viewport)
}
