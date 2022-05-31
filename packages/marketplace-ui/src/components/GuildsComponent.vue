<script setup lang="ts">
  import { ref } from 'vue'
  import FilterComponent from './FilterComponent.vue'
  import ResultComponent from './ResultComponent.vue'
  const minCP = ref(0)
  const maxCP = ref(6750)
</script>

<template>
  <div class="flex h-full overflow-y-hidden">
    <FilterComponent
      ><div
        class="flex flex-col w-full justify-center items-center p-2 space-y-2 pb-4"
      >
        <span class="text-lg font-semibold">Combat Power</span>
        <div class="flex w-full gap-2">
          <div class="flex flex-col w-1/2 justify-center items-center">
            <label for="minCP">Min</label>
            <input
              v-model="minCP"
              type="number"
              id="minCP"
              class="w-full text-black rounded-md"
            />
          </div>
          <div class="flex flex-col w-1/2 justify-center items-center">
            <label for="maxCP">Max</label>
            <input
              v-model="maxCP"
              type="number"
              id="maxCP"
              class="w-full text-black rounded-md"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-col w-full justify-center items-center p-2 space-y-2"
      >
        <span class="text-lg font-semibold">Others</span>
        <div class="flex justify-center items-center gap-2">
          <input type="checkbox" id="genesis" class="rounded-md" />
          <label for="genesis">W/ Emblem</label>
          <input type="checkbox" id="non-genesis" class="rounded-md" />
          <label for="non-genesis">W/o Emblem</label>
        </div>
      </div>
      <template v-slot:search-button>
        <slot name="search-button"></slot>
      </template>
    </FilterComponent>

    <ResultComponent>
      <div class="flex flex-col items-center justify-center h-full">
        COMING SOON
      </div>
    </ResultComponent>
  </div>
</template>
