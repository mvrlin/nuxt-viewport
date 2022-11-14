import { fileURLToPath } from 'url'
import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

import { name, version } from '../package.json'

import { DEFAULT_OPTIONS } from './runtime/manager'
import type { ViewportOptions } from './runtime/types'

export default defineNuxtModule<ViewportOptions>({
  defaults: DEFAULT_OPTIONS,

  meta: {
    configKey: 'viewport',

    compatibility: {
      bridge: true,
    },

    name,
    version,
  },

  setup(options, nuxt) {
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

    addPlugin(resolve(runtimeDir, 'plugin'))

    addImports({
      as: 'useViewport',
      from: resolve(runtimeDir, 'composables'),

      name: 'useViewport',
    })
  },
})
