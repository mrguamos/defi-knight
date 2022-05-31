<template>
  <div class="flex justify-between items-center">
    RARITY
    <div class="flex gap-[2px]">
      <StarIcon
        v-for="r in (item as CharacterCommon).rarity + 1"
        :key="r"
        class="h-4 w-4 text-yellow-300"
      />
      <StarIcon
        v-for="r in 4 - (item as CharacterCommon).rarity"
        :key="r"
        class="h-4 w-4"
      />
    </div>
  </div>
  <div class="flex justify-between">
    <span v-if="nft === 'commanders'">BONUS</span>
    <span v-if="nft === 'knights'">CP</span>
    <div v-if="nft === 'knights'">
      <span>{{ (item as Knight).combatPower }}</span>
      <span v-if="(item as Knight).isGenesis">
        +
        {{ useKnight().bonus }}
      </span>
    </div>
    <div v-if="(item as Commander).isGenesis && nft === 'commanders'">
      MAX WR + {{ useCommander().bonus }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue'
  import type { CharacterCommon } from '../types/common'
  import type { Commander } from '../types/commander'
  import type { Knight } from '../types/knight'
  import { StarIcon } from '@heroicons/vue/solid'
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'

  defineProps({
    item: {
      type: Object as PropType<CharacterCommon>,
      required: true,
    },
    nft: {
      type: String,
      required: true,
    },
  })
</script>
