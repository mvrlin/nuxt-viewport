import { fileURLToPath } from 'url'
import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

import { name, version } from '../package.json'

import { DEFAULT_OPTIONS } from './constants'
import type { ViewportOptions } from './types'

export type ModuleOptions = ViewportOptions

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'viewport',

    compatibility: {
      bridge: true,
    },

    name,
    version,
  },

  setup(options, nuxt) {
    options = {
      ...DEFAULT_OPTIONS,
      ...options,

      cookie: {
        ...DEFAULT_OPTIONS.cookie,
        ...options.cookie,
      },
    }

    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.build.transpile.push(runtimeDir)

    // Inject options via virtual template
    nuxt.options.alias['#viewport-options'] = addTemplate({
      filename: 'viewport-options.mjs',

      getContents() {
        return `export default ${JSON.stringify(options)}`
      },
    }).dst

    addPlugin(resolve(runtimeDir, 'plugin.client'))
    addPlugin(resolve(runtimeDir, 'plugin.server'))

    addImports({
      as: 'useViewport',
      from: resolve(runtimeDir, 'composables'),

      name: 'useViewport',
    })
  },
})
