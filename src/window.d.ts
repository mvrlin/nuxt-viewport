import type { NuxtApp } from '@nuxt/types/app'

declare global {
  interface Window {
    onNuxtReady: (cb: (app: NuxtApp) => void) => void
  }
}

export {}
