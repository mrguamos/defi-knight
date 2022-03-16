<template>
  <div class="flex grow justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
    >
      <div
        v-for="item of items"
        :key="item.id"
        class="h-min text-white inline-flex flex-col space-y-2 p-6 overflow-hidden text-left align-middle transition-all transform border-4 shadow-xl rounded-2xl"
        :class="{
          'border-r0': +item.rarity === 0,
          'border-r1': +item.rarity === 1,
          'border-r2': +item.rarity === 2,
          'border-r3': +item.rarity === 3,
          'border-r4': +item.rarity === 4,
        }"
      >
        <NFTCard :item="item" :nft="nft" :mode="mode" />
        <NFTControls :item="item" :mode="mode" :nft="nft" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Common } from '../types/common'
  import { PropType } from 'vue'

  import NFTCard from './NFTCard.vue'
  import NFTControls from './NFTControls.vue'

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
      type: Array as PropType<Common[]>,
      required: true,
    },
  })
</script>
