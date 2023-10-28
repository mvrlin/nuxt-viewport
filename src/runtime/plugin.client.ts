import { createViewportManager, STATE_KEY } from './manager'

import { defineNuxtPlugin, useState } from '#imports'
import viewportOptions from '#viewport-options'

export default defineNuxtPlugin(async (nuxtApp) => {
  const state = useState<string>(STATE_KEY)
  const manager = createViewportManager(viewportOptions, state)

  // Watch and handle media queries on client.
  nuxtApp.hook('app:mounted', () => {
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

  return nuxtApp.provide('viewport', manager)
})
