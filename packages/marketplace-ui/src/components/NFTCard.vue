<template>
  <div class="flex flex-col max-w-md w-full">
    <img :src="getImageUrl(imageURL)" class="max-w-[10rem] self-center" />
    <div
      class="text-sm font-medium flex flex-col p-6 rounded-md h-min w-full"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      <div class="flex justify-between">
        ID <span>{{ item.id }}</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue'
  import type { Common } from '../types/common'
  import { getImageUrl } from '../utils/util'

  defineProps({
    item: {
      type: Object as PropType<Common>,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
  })
</script>
