<template>
  <div>
    <img
      :src="`/lo-${nft}/${item.class}-${item.gender}-${item.rarity}.png`"
      class="rounded-lg"
    />
    <div
      class="text-sm font-medium flex flex-col p-2 rounded-lg shadow-lg h-min"
    >
      <div class="flex justify-between">
        TOKEN ID <span>{{ item.id }}</span>
      </div>
      <div class="flex justify-between">
        RARITY <span>{{ item.rarity + 1 }}/5</span>
      </div>
      <div class="flex justify-between">
        GENDER <span>{{ item.gender == 0 ? 'Male' : 'Female' }}</span>
      </div>
      <div class="flex justify-between">
        STATS
        <div v-if="nft === 'knights'">
          <span>CP {{ (item as Knight).combatPower }}</span>
          <span v-if="(item as Knight).bonusPower > 0 ">
            +
            {{ (item as Knight).bonusPower }}
          </span>
        </div>
        <div v-if="(item as Commander).isGenesis && nft === 'commanders'">
          MAX WR + 1
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import type { Commander } from '../types/commander'
  import type { Knight } from '../types/knight'
  import type { Common } from '../types/common'

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
