<script setup lang="ts">
  import KnightsSellComponent from '../components/KnightsSellComponent.vue'
  import { useMain } from '../stores/main-store'
  import KnightsBuyComponent from '../components/KnightsBuyComponent.vue'
  import KnightsListComponent from '../components/KnightsListComponent.vue'
  useMain().nft = 'knights'
</script>

<template>
  <KnightsSellComponent v-if="useMain().mode === 'sell'" />
  <KnightsBuyComponent v-if="useMain().mode === 'buy'" />
  <KnightsListComponent v-if="useMain().mode === 'listing'" />
</template>
