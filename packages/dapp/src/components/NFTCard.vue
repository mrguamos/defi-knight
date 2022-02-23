<template>
  <div
    class="flex space-y-2 flex-col p-4 border-4 rounded-lg shadow-lg h-min"
    :class="{
      'border-r0': +item.rarity === 0,
      'border-r1': +item.rarity === 1,
      'border-r2': +item.rarity === 2,
      'border-r3': +item.rarity === 3,
      'border-r4': +item.rarity === 4,
    }"
  >
    <div>
      <img
        :src="`/lo-${nft}/${item.class}-${item.gender}-${item.rarity}.png`"
        class="w-full h-full rounded-lg"
      />
    </div>
    <div
      class="flex items-center flex-col p-2 border-[1px] border-white rounded-lg shadow-lg"
    >
      <div class="flex">
        <StarIconSolid
          v-for="r of +item.rarity + 1"
          :key="r"
          class="h-4 w-4 text-yellow-300"
        />
        <StarIcon
          v-for="r of 5 - (+item.rarity + 1)"
          :key="r"
          class="h-4 w-4 text-gray-300"
        />
      </div>
      <div
        v-if="+(item as Knight).bonusPower > 0 && nft === 'knights'"
        class="flex text-sm font-medium"
      >
        CP {{ (item as Knight).combatPower }} +
        {{ (item as Knight).bonusPower }}
      </div>
      <div
        v-if="(item as Commander).isGenesis && nft === 'commanders'"
        class="flex text-sm font-medium self-center"
      >
        MAX WR + 1
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import type { Commander } from '../types/commander'
  import type { Knight } from '../types/knight'
  import type { Common } from '../types/common'
  import { StarIcon } from '@heroicons/vue/outline'
  import { StarIcon as StarIconSolid } from '@heroicons/vue/solid'

  defineProps({
    nft: {
      type: String,
      required: true,
    },
    item: {
      type: Object as PropType<Common>,
      required: true,
    },
  })
</script>
