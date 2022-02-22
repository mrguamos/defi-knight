<template>
  <div class="flex grow justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
    >
      <div
        v-for="k of paginatedKnights"
        :key="k.id"
        class="flex justify-between space-y-2 flex-col p-4 border-4 rounded-lg shadow-lg max-w-[260px] max-h-[420px]"
        :class="{
          'border-r0': +k.rarity === 0,
          'border-r1': +k.rarity === 1,
          'border-r2': +k.rarity === 2,
          'border-r3': +k.rarity === 3,
          'border-r4': +k.rarity === 4,
        }"
      >
        <div>
          <img
            :src="`/knights/${k.class}-${k.gender}-${k.rarity}.png`"
            class="w-full h-full rounded-lg"
          />
        </div>
        <div
          class="flex items-center justify-between p-2 w-full h-full border-[1px] border-white rounded-lg shadow-lg"
        >
          <div class="flex">
            <StarIconSolid
              v-for="r of +k.rarity + 1"
              :key="r"
              class="h-4 w-4 text-yellow-300"
            />
            <StarIcon
              v-for="r of 5 - (+k.rarity + 1)"
              :key="r"
              class="h-4 w-4 text-gray-300"
            />
          </div>
          <div v-if="+k.bonusPower > 0" class="flex text-sm font-medium">
            CP {{ k.combatPower }} + {{ k.bonusPower }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Knight } from '../types/knight'
  import { PropType } from 'vue'
  import { StarIcon } from '@heroicons/vue/outline'
  import { StarIcon as StarIconSolid } from '@heroicons/vue/solid'

  defineProps({
    paginatedKnights: {
      type: Array as PropType<Knight[]>,
      required: true,
    },
  })
</script>
