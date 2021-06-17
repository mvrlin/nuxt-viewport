import cookie from 'cookie'
import { detectBreakpoint, useViewport } from '~viewport'

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default async function (ctx, inject) {
  const options = <%= serialize(options) %>
  const { req = {} } = ctx.ssrContext

  let breakpoint = options.fallbackBreakpoint

  if (req.headers) {
    const requestCookies = cookie.parse(req.headers.cookie || '')
    breakpoint = await detectBreakpoint.call(options, requestCookies[options.cookieName], req.headers['user-agent'])
  }

  const viewport = useViewport(options, breakpoint)

  ctx.beforeNuxtRender(({ nuxtState }) => {
    nuxtState.viewport = viewport.breakpoint
  })

  inject('viewport', viewport)
}
