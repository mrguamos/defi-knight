<template>
  <div class="flex flex-col h-full pb-10">
    <div class="flex justify-center">
      <div class="">
        <router-link to="/marketplace/commanders">
          <PrimaryButton
            class="rounded-lg-l rounded-r-none border-r-slate-800 border-r-3 tabs"
            >COMMANDERS</PrimaryButton
          >
        </router-link>
        <router-link to="/marketplace/knights">
          <PrimaryButton
            class="rounded-lg-l rounded-r-none rounded-l-none border-r-slate-800 border-r-3 tabs"
            >KNIGHTS</PrimaryButton
          >
        </router-link>
        <PrimaryButton class="rounded-lg-r rounded-l-none tabs"
          >GUILDS</PrimaryButton
        >
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
