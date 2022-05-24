<script setup lang="ts">
  import FilterComponent from '../components/FilterComponent.vue'
  import ResultComponent from '../components/ResultComponent.vue'
</script>

<template>
  <div class="flex h-full overflow-y-hidden">
    <FilterComponent> </FilterComponent>
    <ResultComponent></ResultComponent>
  </div>
</template>
