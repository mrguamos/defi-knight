<template>
  <div v-if="mode === 'inventory'" class="flex">
    <PrimaryButton class="grow"> SELL </PrimaryButton>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import PrimaryButton from './PrimaryButton.vue'
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
