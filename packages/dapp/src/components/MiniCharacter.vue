<template>
  <div class="flex flex-col justify-center items-center lg:px-10 w-full h-full">
    <span class="text-slate-300 font-extrabold text-lg uppercase"
      >{{ nft }}
    </span>

    <ul
      v-if="items.length > 0"
      class="flex flex-col w-full divide-y divide-slate-700 h-full mt-10 overflow-y-auto overscroll-contain"
      :class="{ 'max-h-[364px]': size == 'lg' }"
    >
      <li
        v-for="item in items"
        :key="item.id"
        class="flex justify-between items-center py-2 px-1 w-full hover:cursor-pointer"
        @click="emit('view-item', item, nft)"
      >
        <img
          :src="getImageUrl(item)"
          class="inline-block w-14 h-14 rounded-full ring-2"
          :class="getBorder(item.rarity)"
        />
        <div class="flex flex-col justify-center items-center">
          <span>
            {{
              (nft.toLowerCase().includes('commanders') ? 'C ' : 'K ') +
              '#' +
              Number(item.id).toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })
            }}
          </span>
          <span class="text-yellow-300"> R{{ item.rarity + 1 }} </span>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="flex flex-col w-full items-center justify-center divide-y divide-slate-700 overflow-y-auto h-full lg:mt-10"
      :class="{ 'max-h-[364px]': size == 'lg' }"
    >
      <img src="/src/assets/empty.png" class="inline-block w-24 h-24" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'
  import { CharacterCommon } from '../types/common'

  const emit = defineEmits(['view-item'])

  const props = defineProps({
    nft: {
      type: String,
      required: true,
    },
    items: {
      type: Object as PropType<CharacterCommon[]>,
      required: true,
    },
    size: {
      type: String,
      required: false,
      default: 'lg',
    },
  })

  const getBorder = (rarity: number): string => {
    if (rarity == 0) return 'ring-gray-500'
    else if (rarity == 1) return 'ring-blue-500'
    else if (rarity == 2) return 'ring-green-500'
    else if (rarity == 3) return 'ring-red-500'
    else if (rarity == 4) return 'ring-purple-500'
    return ''
  }

  function getImageUrl(item: CharacterCommon) {
    const _nft = props.nft.toLowerCase().includes('commanders')
      ? 'commanders'
      : 'knights'
    const name = `${_nft}/avatars/${item.gender}-${item.class}.png`
    return new URL(`/src/assets/${name}`, import.meta.url).href
  }
</script>

<style scoped></style>
