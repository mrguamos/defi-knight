<template>
  <div class="relative flex w-full h-full justify-evenly pb-10">
    <div
      class="hidden absolute lg:static lg:flex flex-col items-center w-full h-full border-r border-r-white/50 gap-4"
    >
      <Listbox v-model="selectedNftType" class="w-full max-w-xs">
        <div class="relative mt-1">
          <ListboxButton
            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <span class="block truncate text-black">{{
              selectedNftType.name
            }}</span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <FontAwesomeIcon
                :icon="['fas', 'sort']"
                size="lg"
                class="ml-1 text-black"
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
            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <span class="block truncate text-black">{{
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
                class="ml-1 text-black"
              />
            </span>
          </ListboxButton>

          <transition
            v-if="commanders.length > 0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="c in commanders"
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
            v-if="knights.length > 0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="c in knights"
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
      <PrimaryButton v-if="selectedCharacter > 0" class="mt-5 px-10"
        >ADD</PrimaryButton
      >
    </div>
    <div class="flex flex-col items-center h-full w-full">
      <NFTCard
        v-if="selectedGuild"
        nft="guilds"
        :item="selectedGuild"
        :mode="'manage'"
      />
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

  const account = useAccount()
  const commanders = ref<Commander[]>([])
  const knights = ref<Knight[]>([])
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
    const c = (await useGuild().getGuild(id))[0]
    selectedGuild.value = { ...c, id: id }
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
</script>
