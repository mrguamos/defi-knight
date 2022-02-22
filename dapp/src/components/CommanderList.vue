<template>
  <div class="flex grow justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
    >
      <div
        v-for="comm of paginatedCommanders"
        :key="comm.id"
        class="flex justify-between space-y-2 flex-col p-4 border-4 rounded-lg shadow-lg max-w-[260px] max-h-[410px]"
        :class="{
          'border-r0': +comm.rarity === 0,
          'border-r1': +comm.rarity === 1,
          'border-r2': +comm.rarity === 2,
          'border-r3': +comm.rarity === 3,
          'border-r4': +comm.rarity === 4,
        }"
      >
        <div>
          <img
            :src="`/commanders/${comm.class}-${comm.gender}-${comm.rarity}.png`"
            class="w-full h-full rounded-lg"
          />
        </div>
        <div
          class="flex items-center justify-between p-2 w-full h-full border-[1px] border-white rounded-lg shadow-lg"
        >
          <div class="flex">
            <StarIconSolid
              v-for="r of +comm.rarity + 1"
              :key="r"
              class="h-4 w-4 text-yellow-300"
            />
            <StarIcon
              v-for="r of 5 - (+comm.rarity + 1)"
              :key="r"
              class="h-4 w-4 text-gray-300"
            />
          </div>
          <div
            v-if="comm.isGenesis"
            class="flex text-sm font-medium self-center"
          >
            MAX WR + 1
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Commander } from '../types/commander'
  import { PropType } from 'vue'
  import { StarIcon } from '@heroicons/vue/outline'
  import { StarIcon as StarIconSolid } from '@heroicons/vue/solid'

  defineProps({
    paginatedCommanders: {
      type: Array as PropType<Commander[]>,
      required: true,
    },
  })
</script>
