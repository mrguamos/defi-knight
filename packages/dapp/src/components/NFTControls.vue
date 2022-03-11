<template>
  <div v-if="mode === 'inventory'" class="flex justify-between">
    <button class="text-[#9ba1fd] inline-flex items-center">
      <FontAwesomeIcon :icon="['fas', 'gift']" size="lg" />
    </button>
    <button class="text-[#9ba1fd] inline-flex items-center">
      <FontAwesomeIcon :icon="['fas', 'coins']" size="lg" />
    </button>
  </div>
  <div v-if="mode === 'market'" class="flex justify-between">
    <button class="text-[#9ba1fd] inline-flex items-center">
      <FontAwesomeIcon :icon="['fas', 'ban']" size="lg" />
    </button>
    <button class="text-[#9ba1fd] inline-flex items-center">
      <FontAwesomeIcon :icon="['fas', 'shopping-cart']" size="lg" />
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import type { Common } from '../types/common'

  defineProps({
    mode: {
      type: String,
      required: true,
    },
    item: {
      type: Object as PropType<Common>,
      required: true,
    },
  })
</script>
