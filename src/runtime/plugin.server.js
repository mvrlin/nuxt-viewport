import cookie from 'cookie'
import { detectBreakpoint, useViewport } from '~viewport'

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default async function (ctx, inject) {
  const options = <%= serialize(options) %>
  const { req = {} } = ctx.ssrContext

  let cookieViewport = ''
  let requestCookies = {}
  let userAgent = ''

  if (req.headers) {
    requestCookies = cookie.parse(req.headers.cookie || '')
    cookieViewport = requestCookies[options.cookieName]
    userAgent = req.headers['user-agent']
  }

  const breakpoint = await detectBreakpoint.call(options, cookieViewport, userAgent)
  const viewport = useViewport(options, breakpoint)

  ctx.beforeNuxtRender(({ nuxtState }) => {
    nuxtState.viewport = viewport.breakpoint
  })

  inject('viewport', viewport)
}
