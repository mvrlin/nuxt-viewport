import { computed, type ComputedRef } from 'vue-demi'
import type { ViewportManager, ViewportOptions } from './types'
import { extendOptions } from './utils'
import { useNuxtApp, useRoute } from '#imports'
import globalOptions from '#viewport-options'

export function useViewport(): ViewportManager {
  return useNuxtApp().$viewport
}

export function useViewportOptions(): ComputedRef<ViewportOptions> {
  const route = useRoute()
  return computed(() => extendOptions(route.meta.viewport, globalOptions))
}
