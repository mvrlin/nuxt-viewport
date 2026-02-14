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

  return nuxtApp.provide('viewport', manager)
})
