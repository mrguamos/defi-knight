<template>
  <div class="flex flex-col max-w-md w-full">
    <img
      :src="
        getImageUrl(`${nft}/${(item as CharacterCommon).class}-${(item as CharacterCommon).gender}-${(item as CharacterCommon).rarity}.png`)
      "
      class="max-w-[10rem] self-center"
    />
    <div
      class="text-sm font-medium flex flex-col p-6 rounded-md h-min w-full"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      <div class="flex justify-between">
        ID <span>{{ item.id }}</span>
      </div>
      <div class="flex justify-between">
        RARITY
        <div class="flex gap-[2px]">
          <FontAwesomeIcon
            v-for="r in (item as CharacterCommon).rarity + 1"
            :key="r"
            :icon="['fa', 'star']"
            size="sm"
            class="text-yellow-300"
          />
          <FontAwesomeIcon
            v-for="r in 4 - (item as CharacterCommon).rarity"
            :key="r"
            :icon="['far', 'star']"
            size="sm"
          />
        </div>
      </div>

      <div class="flex justify-between">
        <span v-if="nft === 'commanders'">BONUS</span>
        <span v-if="nft === 'knights'">CP</span>
        <div v-if="nft === 'knights'">
          <span>{{ (item as Knight).combatPower }}</span>
          <span v-if="(item as Knight).bonusPower > 0 ">
            +
            {{ (item as Knight).bonusPower }}
          </span>
        </div>
        <div v-if="(item as Commander).isGenesis && nft === 'commanders'">
          MAX WR + 1
        </div>
      </div>
      <div
        v-if="mode === 'market'"
        class="flex justify-between mt-2 border-t pt-2"
      >
        AMOUNT <span>{{ main.getEthAmount((item as Market).amount) }}</span>
      </div>
      <div class="pt-3">
        <NFTControls :item="item" :mode="mode" :nft="nft" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import type { Commander } from '../types/commander'
  import type { Knight } from '../types/knight'
  import type { Common } from '../types/common'
  import type { CharacterCommon } from '../types/common'
  import type { Market } from '../types/market'
  import { useMain } from '../stores/main-store'
  import NFTControls from './NFTControls.vue'

  defineProps({
    nft: {
      type: String,
      required: true,
    },
    item: {
      type: Object as PropType<Common>,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  })

  const main = useMain()

  function getImageUrl(name: string) {
    return new URL(`/src/assets/${name}`, import.meta.url).href
  }
</script>
