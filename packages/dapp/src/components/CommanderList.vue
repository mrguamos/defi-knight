<template>
  <div class="flex grow justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
    >
      <NFTCard
        v-for="commander of paginatedCommanders"
        :key="commander.id"
        :item="commander"
        nft="commanders"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Commander } from '../types/commander'
  import { PropType } from 'vue'

  import NFTCard from './NFTCard.vue'

  defineProps({
    paginatedCommanders: {
      type: Array as PropType<Commander[]>,
      required: true,
    },
  })
</script>
