<template>
  <div
    v-if="!useMain().filter || useMain().width > 1024"
    class="absolute lg:static z-10 lg:z-0 bg-gray-900/50 flex w-full flex-col overflow-y-auto overflow-x-hidden border-r-2 border-r-gray-500/20 items-center"
    style="height: calc(100vh - 142px)"
  >
    <div class="py-5 flex relative w-full justify-center items-center text-xl">
      <span class="text-lg font-semibold">RESULT</span>
      <button
        @click="useMain().filter = !useMain().filter"
        class="lg:hidden absolute right-1 mr-3 text-sm uppercase border-2 border-teal-700 rounded-lg p-2 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
      >
        FILTER
      </button>
    </div>
    <div class="border-b border-gray-500/50 w-full"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useMain } from '../stores/main-store'
</script>
