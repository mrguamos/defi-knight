<script setup lang="ts">
  import GuildsComponent from '../components/GuildsComponent.vue'
</script>

<template>
  <GuildsComponent>
    <template v-slot:search-button>
      <button
        class="uppercase border-2 border-teal-700 rounded-lg p-2 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
      >
        Search
      </button>
    </template></GuildsComponent
  >
</template>
