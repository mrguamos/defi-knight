<template>
  <div
    v-if="modelValue"
    class="z-20 flex h-screen w-full fixed grow bg-transparent"
    @click="emit('update:modelValue', false)"
  ></div>
  <div
    class="drawer z-20 flex flex-col h-full fixed w-72 ease-in-out duration-300"
    :class="modelValue ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="self-center pt-10 pb-10">
      <router-link to="/" @click="emit('update:modelValue', false)">
        <img src="/src/assets/logo-header.png" class="w-56" />
      </router-link>
    </div>

    <div class="flex flex-col space-y-2 ml-10 text-base uppercase">
      <RouterLink to="/buy" @click="emit('update:modelValue', false)">
        <span class="">Buy</span>
      </RouterLink>
      <RouterLink to="/sell" @click="emit('update:modelValue', false)">
        <span class="">Sell</span>
      </RouterLink>
      <RouterLink to="/listings" @click="emit('update:modelValue', false)">
        <span class="">Listings</span>
      </RouterLink>
      <RouterLink to="/shop" @click="emit('update:modelValue', false)">
        <span class="">Shop</span>
      </RouterLink>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { RouterLink } from 'vue-router'
  const emit = defineEmits(['update:modelValue'])

  defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  })
</script>

<style scoped>
  .drawer {
    @apply bg-black bg-opacity-90;
  }
</style>
