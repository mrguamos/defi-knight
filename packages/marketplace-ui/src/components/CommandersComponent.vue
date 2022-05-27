<script setup lang="ts">
  import FilterComponent from '../components/FilterComponent.vue'
  import ResultComponent from '../components/ResultComponent.vue'
  import CharacterFilter from '../components/CharacterFilter.vue'
</script>

<template>
  <div class="flex h-full">
    <FilterComponent
      ><CharacterFilter> </CharacterFilter>
      <template v-slot:search-button>
        <slot name="search-button"></slot>
      </template>
    </FilterComponent>
    <ResultComponent> </ResultComponent>
  </div>
</template>
