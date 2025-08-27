import cookie from 'cookiejs'

import { useViewportOptions } from './composables'
import { STATE_KEY, STATE_USE_COOKIE_KEY, STORAGE_USE_COOKIE_KEY } from './constants'
import { createViewportManager } from './manager'

import { defineNuxtPlugin, useState, watchEffect } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const viewportOptions = useViewportOptions()

  const state = useState<string>(STATE_KEY)
  const useCookie = useState<boolean>(STATE_USE_COOKIE_KEY, () => viewportOptions.value.useCookie)

  const manager = createViewportManager(viewportOptions, state, useCookie)

  // Watch and handle media queries on client.
  nuxtApp.hook('app:suspense:resolve', () => {
    const localUseCookie = localStorage.getItem(STORAGE_USE_COOKIE_KEY)

    if (localUseCookie != null) {
      useCookie.value = localUseCookie === 'true'
    }

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

    watchEffect(() => {
      const breakpoint = manager.breakpoint.value
      const withCookie = useCookie.value

      localStorage.setItem(STORAGE_USE_COOKIE_KEY, String(withCookie))

      if (withCookie) {
        return cookie.set(viewportOptions.value.cookie.name, breakpoint, viewportOptions.value.cookie)
      }

      cookie.remove(viewportOptions.value.cookie.name)
    })
  })

  return nuxtApp.provide('viewport', manager)
})
