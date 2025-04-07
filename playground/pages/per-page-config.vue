<template>
  <ViewportState />
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  viewport: {
    breakpoints: {
      desktop: 1024,
      mobile: 320,
      tablet: 768,
    },
    cookie: {
      name: 'viewport-per-page-config',
    },
  },
})
</script>
