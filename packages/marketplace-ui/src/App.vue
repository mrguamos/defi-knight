<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterView, RouterLink } from 'vue-router'
  import { MenuIcon } from '@heroicons/vue/solid'
  import { useWeb3 } from './stores/web3-store'
  import { useAccount } from './stores/account-store'
  import { useMain } from './stores/main-store'
  import DefiSpinner from './components/DefiSpinner.vue'
  import MenuDrawer from './components/MenuDrawer.vue'

  const eth = useWeb3()
  const account = useAccount()
  const connect = async () => {
    try {
      await eth.connect()
    } catch (error) {
      console.log(error)
    }
  }
  const drawer = ref(false)
</script>

<template>
  <div class="h-screen flex flex-col">
    <MenuDrawer v-model="drawer" />
    <DefiSpinner v-if="useMain().loading" />
    <header
      class="w-full py-1 bg-black bg-opacity-50 flex justify-between items-center shadow-2xl shadow-cyan-500/50"
    >
      <div>
        <img
          src="/src/assets/logo-header.png"
          width="auto"
          height="auto"
          alt="logo"
          class="w-40"
        />
      </div>
      <div class="pr-10 lg:flex gap-10 text-base items-center uppercase hidden">
        <RouterLink to="/buy">
          <span class="">Buy</span>
        </RouterLink>
        <RouterLink to="/sell">
          <span class="">Sell</span>
        </RouterLink>
        <RouterLink to="/listings">
          <span class="">Listings</span>
        </RouterLink>
        <RouterLink to="/shop">
          <span class="">Shop</span>
        </RouterLink>
        <button
          :class="{ hidden: account.isConnected }"
          @click="connect()"
          class="uppercase border-2 border-teal-700 rounded-lg p-2 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
        >
          Connect
        </button>
        <span
          class="p-2 border border-teal-700 rounded-lg"
          :class="{ hidden: !account.isConnected }"
        >
          {{ account.croppedAddress }}
        </span>
      </div>
      <div class="lg:hidden flex items-center pr-5">
        <button>
          <MenuIcon class="h-10 w-10 text-teal-600" @click="drawer = true" />
        </button>
      </div>
    </header>
    <RouterView />
  </div>
</template>
