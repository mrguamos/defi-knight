<template>
  <div class="flex flex-col h-full pb-10">
    <div class="flex justify-center">
      <div class="grid grid-cols-3 gap-2">
        <router-link to="/inventory/commanders">
          <PrimaryButton class="w-full tabs">COMMANDERS</PrimaryButton>
        </router-link>
        <router-link to="/inventory/knights">
          <PrimaryButton class="w-full tabs">KNIGHTS</PrimaryButton>
        </router-link>
        <router-link to="/inventory/guilds">
          <PrimaryButton class="w-full tabs">GUILDS</PrimaryButton>
        </router-link>
      </div>
    </div>
    <div class="pt-10 h-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <!-- <GridPagination /> -->
  </div>
</template>

<script lang="ts" setup>
  import PrimaryButton from '../components/PrimaryButton.vue'
</script>
