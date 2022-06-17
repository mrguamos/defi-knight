<template>
  <div
    v-if="selectedGuild"
    class="flex flex-col w-full h-full items-center justify-center pb-10"
  >
    <div class="flex lg:flex-row items-center justify-center flex-col w-full">
      <div class="w-full flex items-center justify-center">
        <img
          :src="getImageUrl(selectedGuild.emblem)"
          class="max-w-sm md:w-full"
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
                  {{ selectedGuild.winRate }}
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
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{
                    selectedGuild.lastFight > 0
                      ? new Date(selectedGuild.lastFight)
                      : 'N/A'
                  }}
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
                  Max Knight
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{ selectedGuild.maxKnight }}
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
                  Total Knight
                </th>
                <td class="px-20 py-4 md:px-56"></td>

                <th
                  scope="row"
                  class="flex w-full items-center justify-end px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {{ knights.length }}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- <Listbox v-model="selectedNftType" class="w-full max-w-xs">
        <div class="relative mt-1">
          <ListboxButton
            class="bg-transparent border-2 border-teal-700 tex-white relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <span class="block truncate text-white">{{
              selectedNftType.name
            }}</span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <FontAwesomeIcon
                :icon="['fas', 'sort']"
                size="lg"
                class="ml-1 text-teal-500"
              />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="z-40 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="c in nftTypes"
                v-slot="{ active, selected }"
                :key="c.id"
                :value="c"
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
                    >{{ c.name }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                  >
                    <FontAwesomeIcon
                      :icon="['fas', 'check']"
                      size="sm"
                      class="ml-1 text-black"
                    />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>

      <Listbox
        v-if="selectedNftType.id != -1"
        v-model="selectedCharacter"
        class="w-full max-w-xs"
      >
        <div class="relative mt-1">
          <ListboxButton
            class="bg-transparent border-2 border-teal-700 relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <span class="block truncate text-white">{{
              selectedCharacter > 0
                ? selectedCharacter
                : `--Select ${selectedNftType.name} --`
            }}</span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <FontAwesomeIcon
                :icon="['fas', 'sort']"
                size="lg"
                class="ml-1 text-teal-500"
              />
            </span>
          </ListboxButton>

          <transition
            v-if="selectedNftType.id == 0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              v-if="filteredCommanders.length > 0"
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="c in filteredCommanders"
                v-slot="{ active, selected }"
                :key="c.id"
                :value="c.id"
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
                    >{{ c.id }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                  >
                    <FontAwesomeIcon
                      :icon="['fas', 'check']"
                      size="sm"
                      class="ml-1 text-black"
                    />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
          <transition
            v-if="selectedNftType.id == 1"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              v-if="filteredKnights.length > 0"
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="c in filteredKnights"
                v-slot="{ active, selected }"
                :key="c.id"
                :value="c.id"
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
                    >{{ c.id }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                  >
                    <FontAwesomeIcon
                      :icon="['fas', 'check']"
                      size="sm"
                      class="ml-1 text-black"
                    />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
      <NFTCard
        v-if="selectedCharacter > 0 && item && selectedNftType.id == 0"
        nft="commanders"
        :item="item"
        :mode="'inventory'"
      />
      <NFTCard
        v-if="selectedCharacter > 0 && item && selectedNftType.id == 1"
        nft="knights"
        :item="item"
        :mode="'inventory'"
      />
      <PrimaryButton
        v-if="selectedCharacter > 0"
        class="mt-5 px-20"
        @click="addMember()"
        >ADD</PrimaryButton
      >
      <div class="flex justify-evenly w-full">
        <ul>
          <li v-for="c in newCommandersGuild" :key="c"># {{ c }}</li>
        </ul>
        <ul>
          <li v-for="k in newKnightsGuild" :key="k">#{{ k }}</li>
        </ul>
      </div> -->
    </div>
    <button class="mt-10" title="Add Member">
      <FontAwesomeIcon
        :icon="['fas', 'user-plus']"
        size="2x"
        class="text-teal-700"
      />
    </button>
    <div
      class="uppercase mt-10 text-base font-bold py-2 text-teal-700 max-w-lg w-full text-center"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      Commanders
    </div>
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 mt-10 w-full max-w-4xl">
      <div class="inline-block py-2 min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow-md sm:rounded-lg">
          <table class="min-w-full">
            <thead
              class="bg-blue-700 text-white"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <tr>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  ID
                </th>

                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  RARITY
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  BONUS
                </th>
              </tr>
            </thead>
            <tbody class="">
              <tr
                v-for="c of commandersGuild"
                :key="c.id"
                class="border-b even:bg-blue-700/30 odd:bg-blue-700/50 border-gray-700"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ c.id }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ c.rarity }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ c.isGenesis ? commander.bonus + '% WR' : 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      class="uppercase mt-10 text-base font-bold py-2 text-teal-700 max-w-lg w-full text-center"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      Knights
    </div>
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 mt-10 w-full max-w-4xl">
      <div class="inline-block py-2 min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow-md sm:rounded-lg">
          <table class="min-w-full">
            <thead
              class="bg-blue-700 text-white"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <tr>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  ID
                </th>

                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  RARITY
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  Combat Power
                </th>
              </tr>
            </thead>
            <tbody class="">
              <tr
                v-for="k of knightsGuild"
                :key="k.id"
                class="border-b even:bg-blue-700/30 odd:bg-blue-700/50 border-gray-700"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ k.id }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ k.rarity }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{
                    k.isGenesis
                      ? `${k.combatPower} + ${knight.bonus}`
                      : k.combatPower
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'
  import { useAccount } from '../stores/account-store'
  import { Commander } from '../types/commander'
  import { useMain } from '../stores/main-store'
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'
  import NFTCard from '../components/NFTCard.vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import { useRoute } from 'vue-router'
  import { useGuild } from '../stores/guild-store'
  import type { Guild } from '../types/guild'
  import type { Knight } from '../types/knight'
  import { utils } from 'ethers'

  const account = useAccount()
  const commanders = ref<Commander[]>([])
  const knights = ref<Knight[]>([])
  const commandersGuild = ref<Commander[]>([])
  const knightsGuild = ref<Knight[]>([])
  const newCommandersGuild = ref<number[]>([])
  const newKnightsGuild = ref<number[]>([])
  const commander = useCommander()
  const knight = useKnight()
  const main = useMain()
  const selectedCharacter = ref(0)
  const route = useRoute()
  const selectedGuild = ref<Guild>()
  const selectedNftType = ref({
    id: -1,
    name: '--Select NFT Type--',
  })

  const nftTypes = [
    {
      id: 0,
      name: 'Commander',
    },
    {
      id: 1,
      name: 'Knight',
    },
  ]

  const addMember = () => {
    if (selectedNftType.value.id == 0) {
      newCommandersGuild.value.push(selectedCharacter.value)
    } else {
      newKnightsGuild.value.push(selectedCharacter.value)
    }
    selectedCharacter.value = 0
  }

  const getCommanders = async () => {
    if (account.isConnected) {
      try {
        main.loading = true
        commander.bonus = await commander.getBonus()
        const tokens = await commander.getCommanders()
        commanders.value = await Promise.all(
          tokens.map(async (token) => {
            const id = Number(token.toString())
            const c = (await commander.getCommander(id))[0]
            return { ...c, id: id }
          })
        )

        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        main.loading = false
      }
    }
  }

  const filteredKnights = computed(() => {
    const filtered = knights.value.filter((k) => {
      console.log(newKnightsGuild.value.includes(k.id))
      return !newKnightsGuild.value.includes(k.id)
    })
    return filtered
  })

  const filteredCommanders = computed(() => {
    const filtered = commanders.value.filter((k) => {
      console.log(newCommandersGuild.value.includes(k.id))
      return !newCommandersGuild.value.includes(k.id)
    })
    return filtered
  })

  const getKnights = async () => {
    if (account.isConnected) {
      try {
        main.loading = true
        knight.bonus = await knight.getBonus()
        const tokens = await knight.getKnights()
        knights.value = await Promise.all(
          tokens.map(async (token) => {
            const id = Number(token.toString())
            const c = (await knight.getKnight(id))[0]
            return { ...c, id: id }
          })
        )

        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        main.loading = false
      }
    }
  }

  const getGuild = async () => {
    const id = Number(route.params.id)
    selectedGuild.value = (await useGuild().getGuild(id))[0]
    assert(selectedGuild.value)
    if (!Number(selectedGuild.value.id)) {
      selectedGuild.value = undefined
    }
    const res = await Promise.all([
      useGuild().getAllCommanders(id),
      useGuild().getAllKnights(id),
    ])
    commandersGuild.value = (await commander.getCommandersByIds(res[0][0]))[0]
    knightsGuild.value = (await knight.getKnightsByIds(res[1][0]))[0]
  }

  getGuild()

  function assert(value: unknown): asserts value {
    //
  }

  const item = computed(() => {
    if (selectedNftType.value.id == 0) {
      const c = commanders.value.find((i) => i.id == selectedCharacter.value)
      assert(c)
      return c
    } else if (selectedNftType.value.id == 1) {
      const k = knights.value.find((i) => i.id == selectedCharacter.value)
      assert(k)
      return k
    }
    return undefined
  })

  watch(selectedNftType, (selectedNftType) => {
    selectedCharacter.value = 0
    if (selectedNftType.id == 0) {
      getCommanders()
    } else if (selectedNftType.id == 1) {
      getKnights()
    }
  })

  function getImageUrl(id: number) {
    return new URL(`/src/assets/emblems/${id}.png`, import.meta.url).href
  }
</script>
