<script setup lang="ts">
  import { useKnight } from '../stores/knight-store'
  import { useMain } from '../stores/main-store'
  const knight = useKnight()
  const reset = () => {
    knight.$reset()
    if (useMain().key == 0) useMain().key = 1
    else useMain().key = 0
  }
</script>

<template>
  <button
    @click="reset()"
    class="uppercase border-2 border-red-700 rounded-lg p-2 bg-transparent hover:bg-red-600/50 active:border-transparent active:ring active:ring-red-700"
  >
    Reset
  </button>
</template>
