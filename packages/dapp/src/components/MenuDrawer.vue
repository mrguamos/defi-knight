<template>
  <div
    class="z-30 flex h-screen grow w-full fixed"
    :class="{
      invisible: !modelValue,
    }"
  >
    <div
      class="drawer flex flex-col h-full w-72 ease-in-out duration-300 shadow-lg overflow-y-auto overscroll-contain"
      :class="modelValue ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="self-center pt-10 pb-10">
        <router-link
          to="/"
          @click="
            () => {
              emit('update:modelValue', false)
              useMain().drawer = false
            }
          "
        >
          <img src="/src/assets/logo-header.png" class="w-56" />
        </router-link>
      </div>

      <div class="flex flex-col space-y-2 ml-2">
        <router-link
          to="/commanders"
          @click="
            () => {
              emit('update:modelValue', false)
              useMain().drawer = false
            }
          "
        >
          <HeaderButton>COMMANDERS</HeaderButton>
        </router-link>
        <router-link
          to="/knights"
          @click="
            () => {
              emit('update:modelValue', false)
              useMain().drawer = false
            }
          "
        >
          <HeaderButton>KNIGHTS</HeaderButton>
        </router-link>
        <router-link
          to="/guilds"
          @click="
            () => {
              emit('update:modelValue', false)
              useMain().drawer = false
            }
          "
        >
          <HeaderButton>GUILDS</HeaderButton>
        </router-link>
        <!-- <router-link to="/conquer" @click="
            () => {
              emit('update:modelValue', false)
              useMain().drawer = false
            }
          ">
        <HeaderButton>CONQUER</HeaderButton>
      </router-link> -->
        <a
          href="https://marketplace.defiknight.io"
          target="_blank"
          @click="
            () => {
              emit('update:modelValue', false)
              useMain().drawer = false
            }
          "
        >
          <HeaderButton
            >MARKETPLACE
            <FontAwesomeIcon
              :icon="['fas', 'external-link-alt']"
              size="lg"
              class="ml-2"
          /></HeaderButton>
        </a>
      </div>
    </div>
    <div
      class="grow"
      @click="
        () => {
          emit('update:modelValue', false)
          useMain().drawer = false
        }
      "
    ></div>
  </div>
</template>
<script lang="ts" setup>
  import { useMain } from '../stores/main-store'
  import HeaderButton from './HeaderButton.vue'

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
    @apply bg-slate-900 bg-opacity-90;
  }
</style>
