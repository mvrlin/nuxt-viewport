import { type ViewportManager } from '../types'
import { useNuxtApp } from '#imports'

export function useViewport(): ViewportManager {
  return useNuxtApp().$viewport
}
