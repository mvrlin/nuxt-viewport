import { useViewportOptions } from './composables'
import { STATE_KEY, STATE_USE_COOKIE_KEY } from './constants'
import { createViewportManager } from './manager'
import { detectBreakpoint, parseCookie } from './utils'

import { computed, defineNuxtPlugin, useState } from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const viewportOptions = useViewportOptions()

  const state = useState<string>(STATE_KEY)
  const useCookie = useState<boolean>(STATE_USE_COOKIE_KEY, () => viewportOptions.value.useCookie)

  const manager = createViewportManager(viewportOptions, state, useCookie)
  const headers = nuxtApp?.ssrContext?.event?.req?.headers

  let cookie = headers == null ? '' : headers.cookie
  if (typeof cookie !== 'string') {
    cookie = ''
  }

  state.value = await detectBreakpoint(viewportOptions.value, {
    cookie: viewportOptions.value.cookie?.name ? parseCookie(cookie)[viewportOptions.value.cookie.name] : undefined,
    headers,
  })

  return nuxtApp.provide('viewport', manager)
})
