<template>
  <div class="flex grow justify-center w-full px-4">
    <div
      class="grid grid-cols-1 result-sm:grid-cols-2 result-md:grid-cols-3 result-lg:grid-cols-4 result-xl:grid-cols-5 result-2xl:grid-cols-6 gap-7 w-full"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
