<script setup lang="ts">
  import { ref } from 'vue'
  import FilterComponent from '../components/FilterComponent.vue'
  import ResultComponent from '../components/ResultComponent.vue'
  import CharacterFilter from '../components/CharacterFilter.vue'
  const minCP = ref(0)
  const maxCP = ref(250)
</script>

<template>
  <div class="flex h-full overflow-y-hidden">
    <FilterComponent>
      <CharacterFilter>
        <div
          class="flex flex-col w-full justify-center items-center p-2 space-y-2"
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
      </CharacterFilter>
    </FilterComponent>
    <ResultComponent></ResultComponent>
  </div>
</template>
