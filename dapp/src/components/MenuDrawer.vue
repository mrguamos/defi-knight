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
    <button @click="emit('update:modelValue', false)">
      <XIcon class="w-6 h-6 absolute right-1 top-3" />
    </button>
    <div class="pt-2 pb-[18px]">
      <router-link to="/" @click="emit('update:modelValue', false)">
        <img src="/src/assets/logo-header.png" class="w-[170px]" />
      </router-link>
    </div>
    <div class="flex justify-start gap-2 ml-2">
      <div class="flex flex-col space-y-2">
        <router-link to="/commanders" @click="emit('update:modelValue', false)">
          <HeaderButton>COMMANDERS</HeaderButton>
        </router-link>

        <router-link to="/knights" @click="emit('update:modelValue', false)">
          <HeaderButton>KNIGHTS</HeaderButton>
        </router-link>
        <router-link to="/guilds" @click="emit('update:modelValue', false)">
          <HeaderButton>GUILDS</HeaderButton>
        </router-link>
        <router-link to="/conquer" @click="emit('update:modelValue', false)">
          <HeaderButton>CONQUER</HeaderButton>
        </router-link>
        <router-link
          to="/marketplace"
          @click="emit('update:modelValue', false)"
        >
          <HeaderButton>MARKETPLACE</HeaderButton>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import HeaderButton from './HeaderButton.vue'
  import { XIcon } from '@heroicons/vue/solid'

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
    background-color: #141416;
    background-image: url('/src/assets/bg-main.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
