<template>
  <section>
    Your current breakpoint is: <pre>{{ $viewport.breakpoint }}</pre>

    <pre>{{ $viewport.isLessThan('desktop') }}</pre>
    <pre>{{ $viewport.isGreaterThan('desktop') }}</pre>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>
