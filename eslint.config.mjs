// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import pluginPerfectionist from 'eslint-plugin-perfectionist'

export default createConfigForNuxt({
  dirs: {
    src: ['./playground'],
  },

  features: {
    stylistic: true,
    tooling: true,
  },
})
  .prepend(
    pluginPerfectionist.configs['recommended-alphabetical'],
  )
  .override('nuxt/sort-config', {
    rules: {
      'nuxt/nuxt-config-keys-order': 'off',
    },
  })
  .override('nuxt/vue/rules', {
    rules: {
      'vue/attributes-order': [
        'error',
        {
          alphabetical: true,
        },
      ],

      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/padding-line-between-blocks': ['error', 'always'],
    },
  })
  .override('nuxt/vue/single-root', {
    rules: {
      'vue/no-multiple-template-root': 'off',
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  })
