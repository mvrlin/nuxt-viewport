import cookie from 'cookie'
import { detectBreakpoint, useViewport } from '~viewport'

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default async function (ctx, inject) {
  const { headers } = ctx.ssrContext.req
  const options = <%= serialize(options) %>

  const requestCookies = cookie.parse(headers.cookie || '')
  const cookieViewport = requestCookies[options.cookieName]

  const breakpoint = await detectBreakpoint.call(options, cookieViewport, headers['user-agent'])
  const viewport = useViewport(options, breakpoint)

  ctx.beforeNuxtRender(({ nuxtState }) => {
    nuxtState.viewport = viewport.breakpoint
  })

  inject('viewport', viewport)
}
