<template>
  <div v-if="mode === 'inventory'" class="flex justify-between">
    <button class="text-[#9ba1fd]" tooltip="sell">
      <FontAwesomeIcon :icon="['fas', 'gift']" size="lg" />
    </button>
    <button class="text-[#9ba1fd]">
      <FontAwesomeIcon :icon="['fas', 'tag']" size="lg" />
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
