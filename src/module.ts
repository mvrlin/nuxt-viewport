import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { fileURLToPath } from 'node:url'

import type { ViewportOptions } from './runtime/types'

import { name, version } from '../package.json'
import { extendOptions } from './runtime/utils'

export type ModuleOptions = ViewportOptions

export default defineNuxtModule<ModuleOptions>({
  meta: {
    compatibility: {
      // @ts-expect-error property removed in Nuxt 4
      bridge: false,
      nuxt: '>=3.0.0-rc.11',
    },

    configKey: 'viewport',
    name,
    version,
  },

  setup(options, nuxt) {
    options = extendOptions(options)

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
