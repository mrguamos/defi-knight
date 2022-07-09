<template>
  <div
    v-if="selectedGuild"
    class="flex flex-col h-full items-center pb-10 pt-28"
  >
    <div class="flex lg:flex-row items-center justify-center flex-col w-full">
      <div class="w-full flex items-center justify-center">
        <img
          :src="getImageUrl(selectedGuild.emblem)"
          class="max-w-[20rem] md:w-full"
        />
      </div>
      <div class="flex items-center justify-center h-full w-full mt-10 lg:mt-0">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-400">
            <tbody>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <th
                  scope="row"
                  class="flex w-full items-center justify-start px-6 py-4 font-medium text-white whitespace-nowrap uppercase"
                >
                  Id
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{ selectedGuild.id }}
                </th>
              </tr>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <th
                  scope="row"
                  class="flex w-full items-center justify-start px-6 py-4 font-medium text-white whitespace-nowrap uppercase"
                >
                  Name
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{ utils.parseBytes32String(selectedGuild.name) }}
                </th>
              </tr>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <th
                  scope="row"
                  class="flex w-full items-center justify-start px-6 py-4 font-medium text-white whitespace-nowrap uppercase"
                >
                  Morale
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{ selectedGuild.morale }}
                </th>
              </tr>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <th
                  scope="row"
                  class="flex w-full items-center justify-start px-6 py-4 font-medium text-white whitespace-nowrap uppercase"
                >
                  Combat Power
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{ selectedGuild.combatPower }}
                </th>
              </tr>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <th
                  scope="row"
                  class="flex w-full items-center justify-start px-6 py-4 font-medium text-white whitespace-nowrap uppercase"
                >
                  Bonus
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{ selectedGuild.winRate }}% WR
                </th>
              </tr>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <th
                  scope="row"
                  class="flex w-full items-center justify-start px-6 py-4 font-medium text-white whitespace-nowrap uppercase"
                >
                  Last Fight
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-bold whitespace-nowrap"
                  :class="isCooldown ? 'text-green-700' : 'text-red-700'"
                >
                  {{
                    selectedGuild.lastFight > 0
                      ? dayjs
                          .unix(selectedGuild.lastFight)
                          .toDate()
                          .toLocaleString()
                      : 'N/A'
                  }}
                </th>
              </tr>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              ></tr>
              <tr
                class="even:bg-blue-700/30 odd:bg-blue-700/50"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              ></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Listbox
      id="minR"
      v-model="selectedLevel"
      class="w-full max-w-sm mt-20 z-20"
    >
      <div class="relative mt-1">
        <ListboxButton
          class="relative w-full cursor-default rounded-lg bg-transparent border-2 border-teal-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          :class="{ 'text-center': !selectedLevel }"
        >
          <span class="block truncate text-white">{{
            selectedLevel ? selectedLevel : 'SELECT DIFFICULTY'
          }}</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-white"
          >
            <FontAwesomeIcon :icon="['fas', 'caret-down']" size="lg" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="r in rewards.maxLevel"
              v-slot="{ active, selected }"
              :key="r"
              :value="r"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ r }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <FontAwesomeIcon :icon="['fas', 'check']" size="lg" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>

    <div
      v-if="selectedLevel"
      class="flex justify-center items-center w-full mt-10"
    >
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Combat Power</th>
              <th scope="col" class="px-6 py-3">Win Rate</th>
              <th scope="col" class="px-6 py-3">Rewards</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bg-white border-b dark:bg-gray-800/50 dark:border-gray-700 font-bold"
            >
              <td
                scope="row"
                class="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap"
              >
                {{ requiredCP }}
              </td>
              <td class="px-6 py-4 text-gray-900 dark:text-white">
                {{ winRate < 30 ? 0 : winRate }}%
              </td>
              <td class="px-6 py-4 text-gray-900 dark:text-white">
                ${{ amount }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <div
      class="flex w-full md:max-w-2xl h-full justify-center items-center mt-10 bg-black/20 py-20 rounded-lg"
    >
      <swiper
        :loop="true"
        :loop-fill-group-with-blank="true"
        :keyboard="{
          enabled: true,
        }"
        :navigation="true"
        :modules="modules"
        class="w-full h-full max-w-sm md:max-w-2xl"
      >
        <swiper-slide
          v-for="slide in 25"
          :key="slide"
          class="flex justify-center items-center"
          ><div class="flex justify-center items-center w-full h-full mx-20">
            <img
              src="/src/assets/war.jpg"
              class="max-w-sm md:max-w-lg rounded-lg"
            />
            <span class="absolute">LEVEL {{ slide }}</span>
          </div></swiper-slide
        >
      </swiper>
    </div> -->
    <div
      v-if="selectedLevel"
      class="flex items-center justify-center mt-10 w-full max-w-sm animate-pulse"
    >
      <div
        v-if="isCooldown"
        class="hover:cursor-pointer bg-teal-700 flex w-full justify-center items-center p-2 rounded-lg"
        @click="conquer()"
      >
        <span class="">BATTLE</span>
      </div>
      <span v-if="!isCooldown" class="text-red-700 text-base font-bold"
        >COOLDOWN</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { utils } from 'ethers'
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useGuild } from '../stores/guild-store'
  import type { Guild } from '../types/guild'
  import dayjs from 'dayjs'

  import { Swiper, SwiperSlide } from 'swiper/vue'

  // Import Swiper styles
  import 'swiper/css'

  import 'swiper/css/pagination'
  import 'swiper/css/navigation'

  import { Pagination, Navigation, Keyboard } from 'swiper'
  import SwiperClass from 'swiper/types'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import { useGame } from '../stores/game-store'
  import { useMain } from '../stores/main-store'
  import { useAccount } from '../stores/account-store'
  import { useRewards } from '../stores/rewards-store'

  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'

  const game = useGame()
  const main = useMain()

  const modules = [Navigation, Pagination, Keyboard]

  const onSwiper = (swiper: SwiperClass.Swiper) => {
    console.log(swiper)
  }
  const onSlideChange = () => {
    console.log('slide change')
  }

  const selectedGuild = ref<Guild>()
  const route = useRoute()
  const id = Number(route.params.id)
  if (id) {
    getGuild()
  }

  const isCooldown = ref(false)

  async function getGuild() {
    selectedGuild.value = (await useGuild().getGuild(id))[0]

    assert(selectedGuild.value)
    if (!Number(selectedGuild.value.id)) {
      selectedGuild.value = undefined
    } else {
      if (selectedGuild.value.lastFight <= 0) {
        isCooldown.value = true
      } else {
        isCooldown.value = dayjs
          .unix(selectedGuild.value.lastFight)
          .add(1, 'day')
          .isSameOrBefore(dayjs())
      }
    }
  }

  function assert(value: unknown): asserts value {
    //
  }

  const router = useRouter()

  const conquer = async () => {
    // const item = await game.getCombat(1)
    // console.log(item)
    try {
      main.loading = true
      const res = await game.conquer(id, selectedLevel.value)
      const receipt = await res.wait()
      for (const log of receipt.logs) {
        try {
          const data = game.iGame.parseLog(log)
          if (data.name === 'CombatEvent') {
            const item = await game.getCombat(Number(data.args[0].toString()))

            if (Number(item.amount.toString())) {
              alert('WIN')
              return
            }
            alert('LOSE')
          }
        } catch (error) {
          console.log(error)
        } finally {
          router.push('/guilds')
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      main.loading = false
    }
  }

  const rewardsManager = useRewards()
  const rewards = ref()
  const selectedLevel = ref(0)

  const getRewards = async () => {
    rewards.value = await rewardsManager.getRewards()
  }

  getRewards()

  function getImageUrl(id: number) {
    return new URL(`/src/assets/emblems/${id}.png`, import.meta.url).href
  }

  const requiredCP = computed(() => {
    return (
      rewards.value.minCP +
      (selectedLevel.value - 1) * rewards.value.levelIncrement
    )
  })

  const winRate = computed(() => {
    if (selectedGuild.value) {
      const diff = selectedGuild.value.combatPower - requiredCP.value
      let subLevel = Math.floor(diff / rewards.value.cpIncrement)
      if (subLevel > rewards.value.maxSubLevel - 1) {
        subLevel = rewards.value.maxSubLevel - 1
      }
      return rewards.value.minWR + subLevel * rewards.value.wrIncrement
    }
    return 0
  })

  const amount = computed(() => {
    return (
      rewards.value.minAmount +
      rewards.value.amountIncrement * (selectedLevel.value - 1)
    )
  })
</script>

<style scoped></style>
