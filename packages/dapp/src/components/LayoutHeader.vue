<template>
  <MenuDrawer v-model="drawer" />
  <div
    class="flex w-full fixed top-0 z-10 items-center h-20 transition-all duration-700"
    :class="scroll ? 'bg-slate-900 bg-opacity-90' : 'bg-transparent'"
  >
    <div class="ml-5 lg:block hidden">
      <router-link to="/">
        <img src="/src/assets/logo-header.png" class="w-40" />
      </router-link>
    </div>
    <div class="flex flex-auto justify-between">
      <div class="ml-5 lg:hidden flex items-center">
        <button class="inline-flex items-center" @click="drawer = true">
          <FontAwesomeIcon :icon="['fas', 'bars']" size="lg" />
        </button>
      </div>
      <div class="lg:flex hidden items-center">
        <router-link to="/commanders">
          <HeaderButton>COMMANDERS</HeaderButton>
        </router-link>
        <router-link to="/knights">
          <HeaderButton>KNIGHTS</HeaderButton>
        </router-link>
        <router-link to="/guilds">
          <HeaderButton>GUILDS</HeaderButton>
        </router-link>
        <router-link to="/conquer">
          <HeaderButton>CONQUER</HeaderButton>
        </router-link>
        <a href="https://marketplace.defiknight.io" target="_blank">
          <HeaderButton
            >MARKETPLACE
            <FontAwesomeIcon
              :icon="['fas', 'external-link-alt']"
              size="lg"
              class="ml-2"
          /></HeaderButton>
        </a>
      </div>
      <div class="flex items-center">
        <a href="https://pancakeswap.finance/swap" target="_blank">
          <div class="relative">
            <HeaderButton class="inline-flex items-center">
              <DKIcon class="w-9 h-9" />
              <div class="absolute right-2 bottom-6">
                <span class="text-2xl font-extrabold text-red-600">+</span>
              </div>
            </HeaderButton>
          </div>
        </a>

        <button
          class="mr-5 px-4 py-2 text-sm xl:text-sm border-2 border-teal-700 rounded-lg hover:mix-blend-screen font-medium text-white"
          :class="{ hidden: account.isConnected }"
          @click="connect()"
        >
          CONNECT
        </button>

        <Menu
          as="div"
          class="relative text-white mr-5"
          :class="{ hidden: !account.isConnected }"
        >
          <div class="flex items-center">
            <MenuButton
              class="flex justify-center items-center w-full px-4 py-2 text-sm xl:text-sm font-medium border-2 border-teal-700 rounded-lg hover:bg-blue-900/30"
              ><span>
                {{ account.croppedAddress }}
              </span>
              <FontAwesomeIcon
                :icon="['fas', 'angle-down']"
                size="lg"
                class="ml-1"
              />
            </MenuButton>
          </div>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="text-white text-sm mt-2 p-2 font-medium border border-teal-700 bg-slate-900 bg-opacity-90 absolute right-0 rounded-lg shadow-lg w-48"
            >
              <MenuItem>
                <span
                  class="block px-4 py-2 hover:cursor-pointer hover:shadow-text rounded-lg"
                >
                  {{ numeral(account.getTotalDK('ether')).format('0a.00') }} DK
                </span>
              </MenuItem>
              <MenuItem>
                <span
                  class="block px-4 py-2 hover:cursor-pointer hover:shadow-text rounded-lg"
                >
                  REWARDS
                </span>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
  import HeaderButton from './HeaderButton.vue'
  import numeral from 'numeral'
  import { useAccount } from '../stores/account-store'
  import { useWeb3 } from '../stores/web3-store'
  import { ref } from 'vue'
  import MenuDrawer from './MenuDrawer.vue'
  import DKIcon from './DKIcon.vue'

  const account = useAccount()
  const eth = useWeb3()
  const drawer = ref(false)
  const scroll = ref(false)

  window.addEventListener('scroll', () => {
    if (window.scrollY > 34) {
      scroll.value = true
      return
    }
    scroll.value = false
  })

  const connect = async () => {
    try {
      await eth.connect()
    } catch (error) {
      console.log(error)
    }
  }
</script>
