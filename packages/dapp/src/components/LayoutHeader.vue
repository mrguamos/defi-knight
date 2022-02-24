<template>
  <MenuDrawer v-model="drawer" />
  <div
    class="bg-gradient-to-r to-[#040a34] from-gray-900 flex w-full fixed top-0 z-10 items-center bg-transparent min-h-[60px] lg:min-h-max"
  >
    <div class="ml-5 lg:block hidden">
      <router-link to="/">
        <img src="/src/assets/logo-header.png" class="w-[170px]" />
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
          <HeaderButton class="ml-5">COMMANDERS</HeaderButton>
        </router-link>

        <router-link to="/knights">
          <HeaderButton>KNIGHTS </HeaderButton>
        </router-link>
        <router-link to="/guilds">
          <HeaderButton>GUILDS</HeaderButton>
        </router-link>
        <router-link to="/conquer">
          <HeaderButton>CONQUER</HeaderButton>
        </router-link>
        <router-link to="/marketplace">
          <HeaderButton>MARKETPLACE</HeaderButton>
        </router-link>
      </div>
      <div class="flex items-center">
        <a href="https://pancakeswap.finance/swap" target="_blank">
          <HeaderButton class="inline-flex items-center mr-2">
            <FontAwesomeIcon :icon="['fas', 'dollar-sign']" class="mr-3" />
            <span>BUY DK</span>
            <FontAwesomeIcon
              :icon="['fas', 'external-link-alt']"
              class="ml-3"
            />
          </HeaderButton>
        </a>

        <button
          class="mr-5 px-4 py-2 text-sm xl:text-md border-2 border-[#1d28b8] ] rounded-lg hover:mix-blend-screen font-medium text-white"
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
              class="flex justify-center items-center w-full px-4 py-2 text-sm xl:text-md font-medium border-2 border-[#1d28b8] rounded-lg hover:mix-blend-hard-light"
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
              class="text-white text-sm mt-2 p-2 font-medium shadow-border focus:outline-none absolute right-0 bg-gradient-to-r from-[#0b0b0b] to-[#141416] rounded-lg shadow-lg w-48"
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

  const account = useAccount()
  const eth = useWeb3()
  const drawer = ref(false)

  const connect = async () => {
    try {
      await eth.connect()
    } catch (error) {
      console.log(error)
    }
  }
</script>
