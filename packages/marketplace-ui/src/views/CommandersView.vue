<script setup lang="ts">
  import CommandersSellComponent from '../components/CommandersSellComponent.vue'
  import { useMain } from '../stores/main-store'
  import CommandersBuyComponent from '../components/CommandersBuyComponent.vue'
  import CommandersListComponent from '../components/CommandersListComponent.vue'
  useMain().nft = 'commanders'
</script>

<template>
  <CommandersSellComponent v-if="useMain().mode === 'sell'" />
  <CommandersBuyComponent v-if="useMain().mode === 'buy'" />
  <CommandersListComponent v-if="useMain().mode === 'listing'" />
</template>
