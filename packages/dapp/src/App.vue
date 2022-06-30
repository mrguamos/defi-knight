<script setup lang="ts">
  import LayoutHeader from './components/LayoutHeader.vue'
  import { useWeb3 } from './stores/web3-store'
  import { useMain } from './stores/main-store'
  import DefiSpinner from './components/DefiSpinner.vue'
</script>

<template>
  <DefiSpinner v-if="useMain().loading" />
  <LayoutHeader />
  <div class="flex min-h-screen">
    <div class="container mx-auto">
      <div v-if="useWeb3().isWrongNetwork" class="flex justify-center">
        <div
          class="text-center w-full p-4 mb-4 max-w-sm text-sm text-white bg-[#530002] rounded-lg"
          role="alert"
        >
          <span class="text-md">Wrong Network</span>
        </div>
      </div>
      <router-view v-if="!useWeb3().isWrongNetwork" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
