<template>
  <div
    v-if="selectedGuild"
    class="flex flex-col w-full h-full justify-center items-center"
  >
    <div class="relative flex flex-col w-full h-full items-center pt-28">
      <Transition mode="out-in">
        <div
          v-show="!addMemberToggle"
          style="backface-visibility: hidden; transform-style: preserve-3d"
          class="absolute flex flex-col w-full lg:bg-black/20 justify-center items-center gap-5 divide-y-2 p-5"
        >
          <div
            class="flex flex-col lg:flex-row w-full md:h-full justify-center items-center md:m-10"
          >
            <MiniCharacter
              class="lg:flex hidden"
              nft="Commanders"
              :items="commandersGuild"
              @view-item="viewItem"
            />
            <div
              class="flex flex-col gap-10 relative w-full justify-start items-center"
            >
              <div class="flex justify-between max-w-sm w-full absolute">
                <button title="Add Member" @click="addMemberToggle = true">
                  <FontAwesomeIcon
                    :icon="['fas', 'user-plus']"
                    size="2x"
                    class="text-teal-700"
                  />
                </button>
                <button title="Disband Guild" @click="disband()">
                  <FontAwesomeIcon
                    :icon="['fas', 'users-slash']"
                    size="2x"
                    class="text-red-700"
                  />
                </button>
              </div>
              <img
                :src="getImageUrl(selectedGuild.emblem)"
                class="max-w-sm md:w-full"
              />
              <div class="text-sm font-bold text-center">
                {{
                  utils.parseBytes32String(selectedGuild.name)
                    ? utils.parseBytes32String(selectedGuild.name)
                    : 'G #' +
                      Number(selectedGuild.id).toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                }}
              </div>
              <div
                class="mt-2 flex w-full md:h-full max-w-sm justify-center items-center gap-5 flex-row-reverse"
                :class="{ 'flex-col': !isCooldown }"
              >
                <button
                  class="text-slate-300 inline-flex items-center"
                  title="Info"
                  @click="showInfo()"
                >
                  <FontAwesomeIcon
                    :icon="['fas', 'info-circle']"
                    size="2x"
                    class=""
                  />
                </button>
                <button
                  v-if="isCooldown"
                  class="text-red-700 inline-flex items-center"
                  title="Conquer"
                  @click="showConquer()"
                >
                  <FontAwesomeIcon
                    :icon="['fas', 'khanda']"
                    size="2x"
                    class="animate-ping absolute"
                  />
                  <FontAwesomeIcon
                    :icon="['fas', 'khanda']"
                    size="2x"
                    class=""
                  />
                </button>
                <CountDown
                  v-else
                  :timestamp="Number(selectedGuild.lastFight.toString())"
                />
              </div>
            </div>
            <MiniCharacter
              class="lg:flex hidden"
              nft="Knights"
              :items="knightsGuild"
              @view-item="viewItem"
            />
          </div>
          <MiniCharacter
            class="flex lg:hidden pt-10"
            nft="Commanders"
            :items="commandersGuild"
            size="md"
            @view-item="viewItem"
          />
          <MiniCharacter
            class="flex lg:hidden pt-10"
            nft="Knights"
            :items="knightsGuild"
            size="md"
            @view-item="viewItem"
          />
        </div>
      </Transition>
      <Transition mode="out-in">
        <AddMember
          v-show="addMemberToggle"
          style="backface-visibility: hidden; transform-style: preserve-3d"
          class="absolute"
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
                <DialogOverlay class="fixed inset-0 bg-black/90" />
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
                  class="inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform rounded-md"
                >
                  <div class="flex flex-col text-sm gap-4">
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
      <TransitionRoot appear :show="infoDialog" as="template">
        <Dialog as="div" @close="main.loading ? '' : closeInfoModal()">
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
                    <DialogTitle
                      class="text-center text-teal-700 text-base font-bold"
                    >
                      GUILD INFORMATION
                    </DialogTitle>
                    <div class="flex relative justify-center items-center">
                      <img
                        :src="getImageUrl(selectedGuild.emblem)"
                        class="w-28 md:w-40 absolute"
                      />
                      <div
                        class="grid grid-cols-2 text-sm font-medium h-min w-full mt-2 gap-2"
                      >
                        <div
                          class="flex justify-start items-center w-full text-blue-500"
                        >
                          <span>ID</span>
                        </div>
                        <div
                          class="flex justify-end items-center text-yellow-500"
                        >
                          <span>{{ selectedGuild.id }}</span>
                        </div>
                        <div
                          class="flex justify-start items-center w-full text-blue-500"
                        >
                          <span>NAME</span>
                        </div>
                        <div
                          class="flex justify-end items-center text-yellow-500"
                        >
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
                                  Number(selectedGuild.id).toLocaleString(
                                    'en-US',
                                    {
                                      minimumIntegerDigits: 2,
                                      useGrouping: false,
                                    }
                                  )
                            }}</span
                          >
                        </div>
                        <div
                          class="flex justify-start items-center w-full text-blue-500"
                        >
                          <span>CP</span>
                        </div>
                        <div
                          class="flex justify-end items-center text-yellow-500"
                        >
                          <span>{{ selectedGuild.combatPower }} </span>
                        </div>
                        <div
                          class="flex justify-start items-center w-full text-blue-500"
                        >
                          <span>MORALE</span>
                        </div>
                        <div
                          class="flex justify-end items-center text-yellow-500"
                        >
                          <span>{{ selectedGuild.morale }}</span>
                        </div>
                        <div
                          class="flex justify-start items-center w-full text-blue-500"
                        >
                          <span>BONUS</span>
                        </div>
                        <div
                          class="flex justify-end items-center text-yellow-500"
                        >
                          <span>{{ selectedGuild.winRate }}%</span>
                        </div>
                        <div
                          class="flex justify-start items-center w-full text-blue-500"
                        >
                          <span class="hidden md:block">COMMANDERS</span>
                          <span class="md:hidden">Cs</span>
                        </div>
                        <div
                          class="flex justify-end items-center text-yellow-500"
                        >
                          <span>{{ commandersGuild.length }}/5</span>
                        </div>
                        <div
                          class="flex justify-start items-center w-full text-blue-500"
                        >
                          <span class="hidden md:block">KNIGHTS</span>
                          <span class="md:hidden">Ks</span>
                        </div>
                        <div
                          class="flex justify-end items-center text-yellow-500"
                        >
                          <span
                            >{{ knightsGuild.length }}/{{
                              selectedGuild.maxKnight
                            }}</span
                          >
                        </div>
                      </div>
                    </div>
                    <div
                      class="flex justify-center gap-4 text-sm text-white mt-2"
                    >
                      <SecondaryButton @click="closeInfoModal()">
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
      <TransitionRoot appear :show="moraleDialog" as="template">
        <Dialog as="div" @close="main.loading ? '' : closeMoraleModal()">
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
                  class="inline-block w-auto max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
                  style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
                >
                  <DialogTitle
                    as="h3"
                    class="text-center text-lg font-medium text-teal-700"
                    ><div class="flex flex-col gap-2">
                      <span class="text-red-700 animate-pulse"
                        >ADDITIONAL MORALE</span
                      >
                      <div class="flex justify-center items-center">
                        {{ moraleFee }} DK
                        <DKIcon class="w-10 h-10 ml-1" />
                      </div>
                    </div>
                  </DialogTitle>
                  <div class="flex grow flex-col text-sm gap-4 mt-5">
                    <div class="flex justify-center gap-4 text-sm text-white">
                      <PrimaryButton @click="buyMorale()">
                        SUBMIT</PrimaryButton
                      >
                      <SecondaryButton c @click="closeMoraleModal()">
                        CANCEL</SecondaryButton
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
  import dayjs from 'dayjs'
  import { utils } from 'ethers'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAccount } from '../stores/account-store'
  import { useCommander } from '../stores/commander-store'
  import { useGame } from '../stores/game-store'
  import { useGuild } from '../stores/guild-store'
  import { useKnight } from '../stores/knight-store'
  import { useMain } from '../stores/main-store'
  import { usePriceManager } from '../stores/price-manager-store'
  import { Commander } from '../types/Commander'
  import { Guild } from '../types/guild'
  import { Knight } from '../types/knight'
  import CountDown from '../components/CountDown.vue'
  import MiniCharacter from '../components/MiniCharacter.vue'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'
  import { CharacterCommon } from '../types/common'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import NFTCard from '../components/NFTCard.vue'
  import AddMember from '../components/AddMember.vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import DKIcon from '../components/DKIcon.vue'

  const account = useAccount()
  const addMemberToggle = ref(false)
  const route = useRoute()
  const id = Number(route.params.id)
  const selectedGuild = ref<Guild>()
  const isCooldown = ref(false)
  const game = useGame()
  const guild = useGuild()

  const commanders = ref<Commander[]>([])
  const knights = ref<Knight[]>([])
  const commandersGuild = ref<Commander[]>([])
  const knightsGuild = ref<Knight[]>([])
  const commander = useCommander()
  const knight = useKnight()
  const router = useRouter()
  const moraleFee = ref(0)
  const priceManager = usePriceManager()
  const moraleDialog = ref(false)

  const infoDialog = ref(false)

  const submit = async () => {
    if (selectedGuild.value?.morale) {
      showMoraleDialog()
      return
    }
    addMembers()
  }

  const addMembers = async () => {
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

  const closeMoraleModal = () => {
    moraleDialog.value = false
  }

  const showMoraleDialog = async () => {
    if (selectedGuild.value) {
      moraleFee.value =
        Number(utils.formatUnits(await priceManager.getMoraleFee(), 'ether')) *
        (newKnightsGuild.value.length * selectedGuild.value.morale)
      moraleDialog.value = true
    }
  }

  const buyMorale = async () => {
    try {
      main.loading = true
      const tx = await game.buyMorale(id)
      await tx.wait()
      closeMoraleModal()
      router.push(`/conquer/${id}`)
    } catch (error) {
      //
    } finally {
      main.loading = false
    }
  }

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

  const newCommandersGuild = ref<Commander[]>([])
  const newKnightsGuild = ref<Knight[]>([])

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

  const selected = ref<CharacterCommon>()
  const selectedNft = ref('')

  const viewItem = (item: CharacterCommon, nft: string) => {
    selectedNft.value = nft.toLowerCase()
    selected.value = item
    dialog.value = true
  }

  const main = useMain()

  const dialog = ref(false)

  const closeModal = () => {
    dialog.value = false
  }

  const closeInfoModal = () => {
    infoDialog.value = false
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
        console.log(e)
      } finally {
        main.loading = false
      }
    }
  }

  getKnights()
  getCommanders()

  const showInfo = () => {
    infoDialog.value = true
  }

  const getGuild = async () => {
    try {
      useMain().loading = true
      selectedGuild.value = (await useGuild().getGuild(id))[0]
      if (selectedGuild.value) {
        if (!Number(selectedGuild.value.id)) {
          selectedGuild.value = undefined
          return
        }
        if (selectedGuild.value.lastFight <= 0) {
          isCooldown.value = true
        } else {
          isCooldown.value = dayjs
            .unix(selectedGuild.value.lastFight)
            .add(1, 'day')
            .isSameOrBefore(dayjs())
        }
        const res = await Promise.all([
          useGuild().getAllCommanders(id),
          useGuild().getAllKnights(id),
        ])
        commandersGuild.value = (
          await commander.getCommandersByIds(res[0][0])
        )[0]
        knightsGuild.value = (await knight.getKnightsByIds(res[1][0]))[0]
      }
    } catch (error) {
      //
    } finally {
      useMain().loading = false
    }
  }

  getGuild()

  const showConquer = async () => {
    if (selectedGuild.value) {
      if (selectedGuild.value.morale > 0) {
        router.push(`/conquer/${selectedGuild.value.id}`)
      } else {
        const knights = (await guild.getAllKnights(selectedGuild.value.id))[0]
        console.log(knights)
        moraleFee.value =
          Number(
            utils.formatUnits(await priceManager.getMoraleFee(), 'ether')
          ) *
          (14 * knights.length)

        moraleDialog.value = true
      }
    }
  }

  const disband = async () => {
    try {
      main.loading = true
      const tx = await game.disbandGuild(id)
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
    transition: transform 1s ease;
  }

  .v-enter-from,
  .v-leave-to {
    transform: rotateY(180deg);
  }
</style>
