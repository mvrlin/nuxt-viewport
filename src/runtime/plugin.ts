import { createViewportManager, STATE_KEY } from './manager'
import { detectBreakpoint, parseCookie } from './utils'

import { defineNuxtPlugin, useState } from '#imports'
import viewportOptions from '#viewport-options'

export default defineNuxtPlugin(async (nuxtApp) => {
  const state = useState<string>(STATE_KEY)
  const manager = createViewportManager(viewportOptions, state)

  // Watch and handle media queries on client.
  nuxtApp.hook('app:suspense:resolve', () => {
    for (const queryKey in manager.queries.value) {
      const { mediaQuery } = manager.queries.value[queryKey]
      const mediaQueryList = window.matchMedia(mediaQuery)

      if (mediaQueryList.matches) {
        manager.breakpoint.value = queryKey
      }

      mediaQueryList.onchange = (event) => {
        if (!event.matches) {
          return
        }

        manager.breakpoint.value = queryKey
      }
    }
  })

  // Don't detect viewport, if we have an initial value.
  if (state.value) {
    return nuxtApp.provide('viewport', manager)
  }

  let cookie = ''
  let userAgent = ''

  if (typeof window === 'undefined') {
    const headers = nuxtApp?.ssrContext?.event?.req?.headers

    if (headers != null) {
      cookie = headers.cookie as string
      userAgent = headers['user-agent'] as string
    }
  } else {
    cookie = document.cookie
    userAgent = navigator.userAgent
  }

  if (typeof cookie !== 'string') {
    cookie = ''
  }

  cookie = parseCookie(cookie)[viewportOptions.cookieName]
  state.value = await detectBreakpoint.call(viewportOptions, cookie, userAgent)

  return nuxtApp.provide('viewport', manager)
})
