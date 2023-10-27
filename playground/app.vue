<script setup lang="ts">
import { useNuxtApp } from '#imports'

const nuxtApp = useNuxtApp()

nuxtApp.hook('app:suspense:resolve', () => {
  console.log('app:suspense:resolve', performance.now())
})

nuxtApp.hook('app:mounted', () => {
  console.log('app:mounted', performance.now())
})
</script>

<template>
  <div>
    <NuxtLayout :name='$viewport.breakpoint.value.includes("mobile") ? "mobile" : "desktop"'>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
