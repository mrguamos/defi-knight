<template>
  <div class="flex flex-col max-w-md w-full">
    <img
      v-if="nft === 'commanders' || nft === 'knight'"
      :src="
        getImageUrl(`${nft}/${(item as CharacterCommon).class}-${(item as CharacterCommon).gender}-${(item as CharacterCommon).rarity}.png`)
      "
      class="max-w-[10rem] self-center"
    />
    <img
      v-if="nft === 'guilds'"
      :src="
        getImageUrl(`emblems/${(item as Guild).emblem}.png`)
      "
      class="max-w-[10rem] self-center"
    />
    <div
      class="text-sm font-medium flex flex-col p-6 rounded-md h-min w-full mt-3"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      <div class="flex justify-between">
        ID <span>{{ item.id }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span v-if="nft === 'commanders' || nft === 'knight'">RARITY</span>
        <div
          v-if="nft === 'commanders' || nft === 'knight'"
          class="flex gap-[2px]"
        >
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
        <span v-if="nft === 'guilds'">NAME</span>
        <span
          v-if="nft === 'guilds'"
          >{{ ethers.utils.parseBytes32String((item as Guild).name) }}</span
        >
      </div>

      <div class="flex justify-between">
        <span v-if="nft === 'commanders'">BONUS</span>
        <div v-if="(item as Commander).isGenesis && nft === 'commanders'">
          MAX WR + 1
        </div>
        <span v-if="nft === 'knights' || nft === 'guilds'">CP</span>
        <div v-if="nft === 'knights'">
          <span>{{ (item as Knight).combatPower }}</span>
          <span v-if="(item as Knight).bonusPower > 0 ">
            +
            {{ (item as Knight).bonusPower }}
          </span>
        </div>
        <span v-if="nft === 'guilds'">{{ (item as Guild).combatPower }}</span>
      </div>

      <div class="flex justify-between">
        <span v-if="nft === 'guilds'">BONUS WINRATE</span>
        <span v-if="nft === 'guilds'">{{ (item as Guild).winRate }}</span>
      </div>

      <div class="flex justify-between">
        <span v-if="nft === 'guilds'">MORALE</span>
        <span v-if="nft === 'guilds'">{{ (item as Guild).morale }}</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import type { Commander } from '../types/commander'
  import type { Knight } from '../types/knight'
  import type { Common } from '../types/common'
  import type { Guild } from '../types/guild'
  import type { CharacterCommon } from '../types/common'
  import { ethers } from 'ethers'

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

  function getImageUrl(name: string) {
    return new URL(`/src/assets/${name}`, import.meta.url).href
  }
</script>
