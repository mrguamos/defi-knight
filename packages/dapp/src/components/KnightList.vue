<template>
  <div class="flex grow justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
    >
      <NFTCard
        v-for="knight of paginatedKnights"
        :key="knight.id"
        :item="knight"
        nft="knights"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Knight } from '../types/Knight'
  import { PropType } from 'vue'

  import NFTCard from './NFTCard.vue'

  defineProps({
    paginatedKnights: {
      type: Array as PropType<Knight[]>,
      required: true,
    },
  })
</script>
