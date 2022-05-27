<template>
  <div
    class="bg-gray-900/50 hidden lg:flex w-full flex-col overflow-y-auto border-r-2 border-r-gray-500/20 items-center divide-y divide-gray-500/50"
    style="height: calc(100vh - 142px)"
  >
    <div class="py-5 flex w-full justify-center items-center text-xl">
      Result
    </div>
    <slot></slot>
  </div>
</template>
