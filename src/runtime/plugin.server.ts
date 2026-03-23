import { defineNuxtPlugin, useState } from '#imports'

import { useViewportOptions } from './composables'
import { createViewportManager, STATE_KEY } from './manager'
import { detectBreakpoint, parseCookie } from './utils'

export default defineNuxtPlugin(async (nuxtApp) => {
  const viewportOptions = useViewportOptions()
  const state = useState<string>(STATE_KEY)
  const manager = createViewportManager(viewportOptions, state)

  let cookie = ''
  const headers = nuxtApp?.ssrContext?.event?.req?.headers

  if (headers != null) {
    cookie = headers.cookie as string
  }

  if (typeof cookie !== 'string') {
    cookie = ''
  }

  state.value = await detectBreakpoint(viewportOptions.value, {
    cookie: viewportOptions.value.cookie?.name ? parseCookie(cookie)[viewportOptions.value.cookie.name] : undefined,
    headers,
  })

  // Set Client Hints response headers when enabled.
  const { clientHints } = viewportOptions.value

  if (clientHints && nuxtApp.ssrContext?.event) {
    const hints = typeof clientHints === 'object' ? clientHints : {}

    if (hints.viewportWidth) {
      const res = nuxtApp.ssrContext.event.node.res

      res.setHeader('Accept-CH', 'Sec-CH-Viewport-Width')

      if (hints.critical) {
        res.setHeader('Critical-CH', 'Sec-CH-Viewport-Width')
      }
    }
  }

  return nuxtApp.provide('viewport', manager)
})
