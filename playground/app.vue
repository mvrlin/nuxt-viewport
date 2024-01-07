<script setup lang="ts">
import { computed, useNuxtApp, useViewport } from '#imports'

const viewport = useViewport()
const nuxtApp = useNuxtApp()

const layoutName = computed(() => {
  return viewport.breakpoint.value.includes('mobile') ? 'mobile' : 'desktop'
})

nuxtApp.hook('app:suspense:resolve', () => {
  console.log('app:suspense:resolve', performance.now())
})

nuxtApp.hook('app:mounted', () => {
  console.log('app:mounted', performance.now())
})
</script>

<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage />
  </NuxtLayout>
</template>
