<script setup lang="ts">
  import LayoutHeader from './components/LayoutHeader.vue'
</script>

<template>
  <LayoutHeader />
  <div class="flex min-h-screen">
    <div class="container mx-auto pt-28">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
