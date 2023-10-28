import { createViewportManager, STATE_KEY } from './manager'
import { detectBreakpoint, parseCookie } from './utils'

import { defineNuxtPlugin, useState } from '#imports'
import viewportOptions from '#viewport-options'

export default defineNuxtPlugin(async (nuxtApp) => {
  const state = useState<string>(STATE_KEY)
  const manager = createViewportManager(viewportOptions, state)

  let cookie = ''
  let userAgent = ''

  const headers = nuxtApp?.ssrContext?.event?.req?.headers

  if (headers != null) {
    cookie = headers.cookie as string
    userAgent = headers['user-agent'] as string
  }

  if (typeof cookie !== 'string') {
    cookie = ''
  }

  cookie = parseCookie(cookie)[viewportOptions.cookieName]

  state.value = await detectBreakpoint.call(viewportOptions, cookie, userAgent)

  return nuxtApp.provide('viewport', manager)
})
