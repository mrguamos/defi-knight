<template>
  <div class="flex justify-center items-center flex-col bg-black bg-opacity-20">
    <img
      :src="getImageUrl(`inventory.png`)"
      class="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
    />
    <div class="py-5">
      <span class="text-2xl neon">Defi Knight Inventory</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  function getImageUrl(name: string) {
    return new URL(`/src/assets/${name}`, import.meta.url).href
  }
</script>
