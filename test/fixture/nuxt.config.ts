import type { NuxtConfig } from '@nuxt/types'

export default {
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/composition-api'],
  modules: ['../../src'],
} as NuxtConfig
