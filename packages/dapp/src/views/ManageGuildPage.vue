<template>
  <div
    v-if="selectedGuild"
    class="flex flex-col w-full h-full items-center justify-center pb-10"
  >
    <Transition>
      <div
        v-show="!addMemberToggle"
        class="flex flex-col w-full h-full items-center justify-center"
      >
        <div
          class="flex lg:flex-row items-center justify-center flex-col w-full"
        >
          <div class="w-full flex items-center justify-center">
            <img
              :src="getImageUrl(selectedGuild.emblem)"
              class="max-w-sm md:w-full"
            />
          </div>
          <div
            class="flex items-center justify-center h-full w-full mt-10 lg:mt-0"
          >
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
                      {{ knightsGuild.length }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button
          class="mt-10"
          title="Add Member"
          @click="addMemberToggle = true"
        >
          <FontAwesomeIcon
            :icon="['fas', 'user-plus']"
            size="2x"
            class="text-teal-700"
          />
        </button>
        <div class="flex flex-col w-full justify-center items-center">
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
                      class="border-b even:bg-blue-700/30 odd:bg-blue-700/50 border-gray-700 hover:cursor-pointer"
                      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
                      @click.stop="
                        () => {
                          selectedNft = 'commanders'
                          selected = c
                          dialog = true
                        }
                      "
                    >
                      <td
                        class="py-4 px-6 text-sm font-medium whitespace-nowrap"
                      >
                        {{ c.id }}
                      </td>
                      <td
                        class="py-4 px-6 text-sm font-medium whitespace-nowrap"
                      >
                        {{ c.rarity + 1 }}
                      </td>
                      <td
                        class="py-4 px-6 text-sm font-medium whitespace-nowrap"
                      >
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
                      class="border-b even:bg-blue-700/30 odd:bg-blue-700/50 border-gray-700 hover:cursor-pointer"
                      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
                      @click.stop="
                        () => {
                          selectedNft = 'knights'
                          selected = k
                          dialog = true
                        }
                      "
                    >
                      <td
                        class="py-4 px-6 text-sm font-medium whitespace-nowrap"
                      >
                        {{ k.id }}
                      </td>
                      <td
                        class="py-4 px-6 text-sm font-medium whitespace-nowrap"
                      >
                        {{ k.rarity + 1 }}
                      </td>
                      <td
                        class="py-4 px-6 text-sm font-medium whitespace-nowrap"
                      >
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
      </div>
    </Transition>
    <Transition>
      <AddMember
        v-show="addMemberToggle"
        :knights="filteredKnights"
        :commanders="filteredCommanders"
        :new-knights="newKnightsGuild"
        :new-commanders="newCommandersGuild"
        @add-commander="addCommander"
        @remove-commander="removeCommander"
        @add-knight="addKnight"
        @remove-knight="removeKnight"
        @submit="submit"
        @close="(val:boolean) => (addMemberToggle = val)"
      />
    </Transition>

    <TransitionRoot appear :show="dialog" as="template">
      <Dialog as="div" @close="main.loading ? '' : closeModal()">
        <div class="fixed inset-0 z-10 overflow-y-auto">
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

            <span class="inline-block h-screen align-middle" aria-hidden="true">
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
                <div class="flex grow flex-col text-sm gap-4">
                  <div class="flex justify-center items-center">
                    <NFTCard
                      :nft="selectedNft"
                      :item="selected!"
                      :mode="'inventory'"
                    />
                  </div>
                  <div
                    class="flex justify-center gap-4 text-sm text-white mt-2"
                  >
                    <SecondaryButton @click="closeModal()">
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
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
  } from '@headlessui/vue'
  import { useAccount } from '../stores/account-store'
  import { Commander } from '../types/commander'
  import { useMain } from '../stores/main-store'
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'
  import { useRoute, useRouter } from 'vue-router'
  import { useGuild } from '../stores/guild-store'
  import { useGame } from '../stores/game-store'
  import type { Guild } from '../types/guild'
  import type { Knight } from '../types/knight'
  import { utils } from 'ethers'
  import AddMember from '../components/AddMember.vue'
  import NFTCard from '../components/NFTCard.vue'
  import type { CharacterCommon } from '../types/common'
  import SecondaryButton from '../components/SecondaryButton.vue'

  const game = useGame()
  const account = useAccount()
  const commanders = ref<Commander[]>([])
  const knights = ref<Knight[]>([])
  const commandersGuild = ref<Commander[]>([])
  const knightsGuild = ref<Knight[]>([])
  const newCommandersGuild = ref<Commander[]>([])
  const newKnightsGuild = ref<Knight[]>([])
  const commander = useCommander()
  const knight = useKnight()
  const main = useMain()
  const route = useRoute()
  const router = useRouter()
  const selectedGuild = ref<Guild>()
  const selected = ref<CharacterCommon>()
  const selectedNft = ref('')

  const addMemberToggle = ref(false)

  const dialog = ref(false)

  const closeModal = () => {
    dialog.value = false
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
      return !newKnightsGuild.value.includes(k)
    })
    return filtered
  })

  const filteredCommanders = computed(() => {
    const filtered = commanders.value.filter((k) => {
      return !newCommandersGuild.value.includes(k)
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

  const id = Number(route.params.id)
  const getGuild = async () => {
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

  getKnights()
  getCommanders()

  const addCommander = (newCommander: Commander) => {
    newCommandersGuild.value.push(newCommander)
  }

  const removeCommander = (id: number) => {
    newCommandersGuild.value.splice(
      newCommandersGuild.value.findIndex((c) => c.id == id),
      1
    )
  }

  const addKnight = (newKnight: Knight) => {
    newKnightsGuild.value.push(newKnight)
  }

  const removeKnight = (id: number) => {
    newKnightsGuild.value.splice(
      newKnightsGuild.value.findIndex((c) => c.id == id),
      1
    )
  }

  const submit = async () => {
    const commanderIds: number[] = []
    const knightIds: number[] = []

    newCommandersGuild.value.forEach((v) => {
      commanderIds.push(v.id)
    })

    newKnightsGuild.value.forEach((v) => {
      knightIds.push(v.id)
    })

    try {
      main.loading = true
      const tx = await game.addGuildMembers(id, commanderIds, knightIds)
      await tx.wait()
      router.push({
        path: `/guilds`,
      })
    } catch (error) {
      //
    } finally {
      main.loading = false
    }
  }

  function getImageUrl(id: number) {
    return new URL(`/src/assets/emblems/${id}.png`, import.meta.url).href
  }
</script>

<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
