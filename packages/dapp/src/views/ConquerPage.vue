<template>
  <div
    v-if="selectedGuild"
    class="flex flex-col h-full items-center pb-10 pt-28 w-full"
  >
    <div class="flex flex-col items-center w-full p-5">
      <div
        style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
        class="flex flex-col max-w-lg w-full justify-center items-center bg-black/50 p-6 rounded-lg"
      >
        <span class="text-center text-teal-700 text-base font-bold"
          >GUILD INFORMATION</span
        >
        <div class="flex relative justify-center items-center w-full my-10">
          <img
            :src="getImageUrl(selectedGuild.emblem)"
            class="w-28 md:w-40 absolute"
          />
          <div
            class="grid grid-cols-2 text-sm font-medium h-min w-full mt-2 gap-2"
          >
            <div class="flex justify-start items-center w-full text-blue-500">
              <span>ID</span>
            </div>
            <div class="flex justify-end items-center text-yellow-500">
              <span>{{ selectedGuild.id }}</span>
            </div>
            <div class="flex justify-start items-center w-full text-blue-500">
              <span>NAME</span>
            </div>
            <div class="flex justify-end items-center text-yellow-500">
              <span
                class="max-w-[90px] md:max-w-[130px]"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                {{
                  utils.parseBytes32String(selectedGuild.name)
                    ? utils.parseBytes32String(selectedGuild.name)
                    : 'G #' +
                      Number(selectedGuild.id).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                }}</span
              >
            </div>
            <div class="flex justify-start items-center w-full text-blue-500">
              <span>CP</span>
            </div>
            <div class="flex justify-end items-center text-yellow-500">
              <span>{{ selectedGuild.combatPower }} </span>
            </div>
            <div class="flex justify-start items-center w-full text-blue-500">
              <span>MORALE</span>
            </div>
            <div class="flex justify-end items-center text-yellow-500">
              <span>{{ selectedGuild.morale }}</span>
            </div>
            <div class="flex justify-start items-center w-full text-blue-500">
              <span>BONUS</span>
            </div>
            <div class="flex justify-end items-center text-yellow-500">
              <span>{{ selectedGuild.winRate }}%</span>
            </div>
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

      <div
        v-if="selectedLevel"
        class="flex items-center justify-center mt-10 w-full max-w-sm animate-pulse"
      >
        <div
          v-if="isCooldown && winRate >= 30"
          class="hover:cursor-pointer bg-teal-700 flex w-full justify-center items-center p-2 rounded-lg"
          @click="conquer()"
        >
          <span class="">BATTLE</span>
        </div>
        <span v-if="!isCooldown" class="text-red-700 text-base font-bold"
          >COOLDOWN</span
        >
      </div>
      <TransitionRoot appear :show="dialog" as="template">
        <Dialog as="div" @close="main.loading ? '' : closeModal()">
          <div class="fixed inset-0 z-40 overflow-y-auto">
            <div class="min-h-screen px-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <DialogOverlay class="fixed inset-0 bg-black opacity-70" />
              </TransitionChild>

              <span
                class="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <div
                  class="inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
                  style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
                >
                  <div class="flex flex-col text-sm gap-4">
                    <div class="flex justify-center items-center">
                      <video class="object-contain" autoplay playsinline>
                        <source
                          :src="result ? victory : defeat"
                          type="video/webm"
                        />
                      </video>
                    </div>
                    <div
                      class="flex justify-center gap-4 text-sm text-white mt-2"
                    >
                      <SecondaryButton @click="closeModal(true)">
                        CLOSE</SecondaryButton
                      >
                    </div>
                  </div>
                </div>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
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

  import { useGame } from '../stores/game-store'
  import { useMain } from '../stores/main-store'
  import { useRewards } from '../stores/rewards-store'
  import victory from '/src/assets/victory.webm'
  import defeat from '/src/assets/defeat.webm'
  import SecondaryButton from '../components/SecondaryButton.vue'

  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'

  const dialog = ref(false)

  const closeModal = (exit?: boolean) => {
    dialog.value = false
    if (exit) router.push('/guilds')
  }

  const showDialog = async () => {
    dialog.value = true
  }

  const game = useGame()
  const main = useMain()

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

  const result = ref(false)

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
              result.value = true
              return
            }
            result.value = false
          }
          // eslint-disable-next-line
        } catch (error: any) {
          if (error.reason) {
            main.errorDialog = true
            main.errorMessage = error.reason
            console.log(error.reason)
          }
        } finally {
          showDialog()
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
