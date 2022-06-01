<script setup lang="ts">
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'
  import { useMain } from '../stores/main-store'

  const idInput = (payload: Event) => {
    if (useMain().nft === 'commanders')
      useCommander().filter.id = Number(
        (payload.target as HTMLInputElement).value
      )
    else if (useMain().nft === 'knights')
      useKnight().filter.id = Number((payload.target as HTMLInputElement).value)
    else
      useCommander().filter.id = Number(
        (payload.target as HTMLInputElement).value
      )
  }

  const idValue = () => {
    if (useMain().nft === 'commanders') return useCommander().filter.id
    else if (useMain().nft === 'knights') return useKnight().filter.id
    else return useCommander().filter.id
  }
</script>

<template>
  <div
    :key="useMain().key"
    class="bg-gray-900/50 w-full flex lg:w-80 flex-col overflow-y-auto border-r-2 border-r-gray-500/20 items-center divide-y divide-gray-500/50 shrink-0"
    style="height: calc(100vh - 142px)"
  >
    <div class="py-5 flex w-full justify-center items-center text-xl">
      Filter
    </div>
    <slot></slot>
    <div
      class="flex flex-col w-full justify-center items-center p-2 pb-4 space-y-2"
    >
      <span class="text-lg font-semibold">ID </span>
      <div class="flex justify-center items-center">
        <input
          type="number"
          class="w-full text-black rounded-md"
          @input="idInput"
          :value="idValue()"
        />
      </div>
    </div>
    <div class="w-full flex items-center justify-center py-2 gap-4">
      <slot name="control-buttons"></slot>
    </div>

    <div class="w-full"></div>
  </div>
</template>
