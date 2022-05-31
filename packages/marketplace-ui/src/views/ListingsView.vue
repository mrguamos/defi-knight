<script setup lang="ts">
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'
  import { useMain } from '../stores/main-store'
  import MarketplaceComponent from '../components/MarketplaceComponent.vue'
  useMain().mode = 'listing'
  const commander = useCommander()
  const knight = useKnight()
  commander.$reset()
  knight.$reset()
</script>

<template>
  <MarketplaceComponent />
</template>
