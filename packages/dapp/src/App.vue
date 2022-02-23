<script setup lang="ts">
  import LayoutHeader from './components/LayoutHeader.vue'
</script>

<template>
  <div class="flex flex-col grow h-screen text-white">
    <LayoutHeader />
    <div class="flex grow pb-10 px-10 pt-28 justify-center">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
