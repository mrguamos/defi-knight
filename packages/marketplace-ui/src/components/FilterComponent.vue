<script setup lang="ts"></script>

<template>
  <div
    class="bg-gray-900/50 hidden lg:flex w-96 flex-col overflow-y-auto border-r-2 border-r-gray-500/20 items-center divide-y divide-gray-500/50"
    style="height: calc(100vh - 142px)"
  >
    <div class="py-5 flex w-full justify-center items-center text-xl">
      Filter
    </div>
    <slot></slot>

    <div class="w-full flex flex-col items-center justify-center h-full">
      <button
        class="uppercase border-2 border-teal-700 rounded-lg p-2 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
      >
        Submit
      </button>
    </div>
  </div>
</template>
