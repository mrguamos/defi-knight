<template>
  <div class="flex grow justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 w-full"
    >
      <div
        v-for="item of items"
        :key="item.id"
        class="h-min text-white flex justify-center px-5 md:px-0"
      >
        <NFTCard :item="item" :nft="nft" :mode="mode" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { CharacterCommon } from '../types/common'
  import { PropType } from 'vue'

  import NFTCard from './NFTCard.vue'

  defineProps({
    mode: {
      type: String,
      required: true,
    },
    nft: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<CharacterCommon[]>,
      required: true,
    },
  })
</script>
