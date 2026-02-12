import { defineNuxtPlugin, useState } from '#imports'

import { useViewportOptions } from './composables'
import { createViewportManager, STATE_KEY } from './manager'

export default defineNuxtPlugin((nuxtApp) => {
  const viewportOptions = useViewportOptions()
  const state = useState<string>(STATE_KEY)
  const manager = createViewportManager(viewportOptions, state)

  const mediaQueryCleanups: (() => void)[] = []

  // Watch and handle media queries on client.
  nuxtApp.hook('app:suspense:resolve', () => {
    for (const queryKey in manager.queries.value) {
      const { mediaQuery } = manager.queries.value[queryKey]
      const mediaQueryList = window.matchMedia(mediaQuery)

      if (mediaQueryList.matches) {
        manager.breakpoint.value = queryKey
      }

      function onChange(event: MediaQueryListEvent) {
        if (!event.matches) {
          return
        }

        manager.breakpoint.value = queryKey
      }

      mediaQueryList.addEventListener('change', onChange)
      mediaQueryCleanups.push(() => mediaQueryList.removeEventListener('change', onChange))
    }
  })

  // Cleanup media queries when unmounted.
  nuxtApp.vueApp.onUnmount(() => {
    while (mediaQueryCleanups.length) {
      mediaQueryCleanups.pop()?.()
    }
  })

  return nuxtApp.provide('viewport', manager)
})
