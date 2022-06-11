<template>
  <div class="flex flex-col max-w-md w-full">
    <img :src="getImageUrl(item)" class="max-w-[10rem] self-center" />
    <div
      class="text-sm font-medium flex flex-col p-6 rounded-md h-min w-full mt-2"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      <div class="flex justify-between">
        ID <span>{{ item.id }}</span>
      </div>
      <div v-if="nft != 'guilds'" class="flex justify-between items-center">
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

      <div v-if="nft != 'guilds'" class="flex justify-between">
        <span v-if="nft === 'commanders'">BONUS</span>
        <span v-if="nft === 'knights'">CP</span>
        <div v-if="nft === 'knights'">
          <span>{{ (item as Knight).combatPower }}</span>
          <span v-if="(item as CharacterCommon).isGenesis ">
            +
            {{ useKnight().bonus }}
          </span>
        </div>
        <div v-if="(item as CharacterCommon).isGenesis && nft === 'commanders'">
          MAX WR + {{ useCommander().bonus }}
        </div>
      </div>
      <div v-if="nft === 'guilds'" class="flex flex-col">
        <div class="flex justify-between">
          <span>NAME</span>
          <span>{{ utils.parseBytes32String((item as Guild).name) }}</span>
        </div>
        <div class="flex justify-between">
          <span>CP</span>
          <span>{{ (item as Guild).combatPower }}</span>
        </div>
        <div class="flex justify-between">
          <span>MAX WR</span>
          <span>{{ (item as Guild).winRate }}</span>
        </div>
        <div class="flex justify-between">
          <span>MORALE</span>
          <span>{{ (item as Guild).morale }}</span>
        </div>
        <div class="flex justify-between">
          <span>LAST FIGHT</span>
          <span>{{ (item as Guild).lastFight }}</span>
        </div>
        <div class="flex justify-between">
          <span>MAX KNIGHT</span>
          <span>{{ (item as Guild).maxKnight }}</span>
        </div>
        <div v-if="mode != 'manage'" class="flex justify-center pt-4">
          <router-link :to="`/guilds/manage/${item.id}`">
            <PrimaryButton>MANAGE</PrimaryButton>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import type { Commander } from '../types/commander'
  import type { Knight } from '../types/knight'
  import type { Guild } from '../types/guild'
  import type { Common } from '../types/common'
  import type { CharacterCommon } from '../types/common'
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'
  import { utils } from 'ethers'
  import PrimaryButton from './PrimaryButton.vue'
  const props = defineProps({
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

  function getImageUrl(item: Common) {
    let name = ''
    if (props.nft == 'guilds') {
      name = `emblems/${(item as Guild).emblem}.png`
    } else {
      name = `${props.nft}/${(item as CharacterCommon).class}-${
        (item as CharacterCommon).gender
      }-${(item as CharacterCommon).rarity}.png`
    }
    return new URL(`/src/assets/${name}`, import.meta.url).href
  }
</script>
