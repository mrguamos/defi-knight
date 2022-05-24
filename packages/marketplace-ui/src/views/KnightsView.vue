<script setup lang="ts">
  import FilterComponent from '../components/FilterComponent.vue'
  import ResultComponent from '../components/ResultComponent.vue'
</script>

<template>
  <div class="flex h-full overflow-y-hidden">
    <FilterComponent>
      <div
        class="flex flex-col w-full justify-center items-center p-2 space-y-2"
      >
        <span class="text-lg font-semibold">Combat Power</span>
        <div class="flex w-full">
          <div class="flex flex-col w-1/2 justify-center items-center">
            <label>Min</label>
          </div>
          <div class="flex flex-col w-1/2 justify-center items-center">
            <label>Max</label>
          </div>
        </div>
      </div>
    </FilterComponent>
    <ResultComponent></ResultComponent>
  </div>
</template>
