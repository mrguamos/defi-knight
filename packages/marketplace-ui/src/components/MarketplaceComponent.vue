<script setup lang="ts">
  import { RouterView, RouterLink } from 'vue-router'
  import { useAccount } from '../stores/account-store'
</script>

<template>
  <div class="flex flex-col h-full" :key="useAccount().address">
    <div
      class="w-full py-5 flex items-center justify-evenly text-base border-y border-y-blue-500"
    >
      <RouterLink to="commanders">
        <span class="uppercase">Commanders</span>
      </RouterLink>
      <RouterLink to="knights">
        <span class="uppercase">Knights</span>
      </RouterLink>
      <RouterLink to="guilds">
        <span class="uppercase">Guilds</span>
      </RouterLink>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <div :key="route.fullPath">
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
  </div>
</template>
