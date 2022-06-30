<template>
  <div class="flex w-full h overflow-y-auto">
    <div class="flex flex-wrap w-full justify-center gap-10 mt-20">
      <div class="flex flex-col max-w-sm w-full justify-center items-center">
        <img src="/src/assets/emblems.png" class="max-h-48" />
        <button
          @click="emblemDialog = true"
          class="border border-teal-700 p-2 rounded-lg uppercase w-full"
        >
          Buy Emblem
        </button>
      </div>
      <div class="flex flex-col max-w-sm w-full justify-center items-center">
        <img src="/src/assets/pots.png" class="max-h-48" />
        <button class="border border-teal-700 p-2 rounded-lg uppercase w-full">
          Coming Soon
        </button>
      </div>
      <EmblemDialog v-model="emblemDialog" v-if="emblemDialog" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import EmblemDialog from '../components/EmblemDialog.vue'

  const emblemDialog = ref(false)
</script>
