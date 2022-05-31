<template>
  <div
    class="bg-gray-900/50 hidden lg:flex w-full flex-col overflow-y-auto overflow-x-hidden border-r-2 border-r-gray-500/20 items-center"
    style="height: calc(100vh - 142px)"
  >
    <div class="py-5 flex w-full justify-center items-center text-xl">
      <span class="text-lg font-semibold">RESULT</span>
    </div>
    <div class="border-b border-gray-500/50 w-full"></div>
    <slot></slot>
  </div>
</template>
