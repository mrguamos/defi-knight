<script setup lang="ts"></script>

<template>
  <div
    class="bg-gray-900/50 w-full flex lg:w-96 flex-col overflow-y-auto border-r-2 border-r-gray-500/20 items-center divide-y divide-gray-500/50 shrink-0"
    style="height: calc(100vh - 142px)"
  >
    <div class="py-5 flex w-full justify-center items-center text-xl">
      Filter
    </div>
    <slot></slot>
    <div
      class="flex flex-col w-full justify-center items-center p-2 pb-4 space-y-2"
    >
      <span class="text-lg font-semibold">ID</span>
      <div class="flex justify-center items-center">
        <input type="number" class="w-full text-black rounded-md" />
      </div>
    </div>
    <div class="w-full flex items-center justify-center py-2 gap-4">
      <slot name="search-button"></slot>
      <button
        class="uppercase border-2 border-red-700 rounded-lg p-2 bg-transparent hover:bg-red-600/50 active:border-transparent active:ring active:ring-red-700"
      >
        Reset
      </button>
    </div>

    <div class="w-full"></div>
  </div>
</template>
