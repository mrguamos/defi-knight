<template>
  <button
    v-if="account.isConnected"
    class="outlined border border-[#1d28b8] rounded-lg shadow-lg px-3 py-2 text-sm xl:text-md font-medium hover:mix-blend-screen"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
  import { useAccount } from '../stores/account-store'
  const account = useAccount()
</script>
