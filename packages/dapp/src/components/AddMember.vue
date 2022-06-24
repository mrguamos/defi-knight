<template>
  <div class="flex flex-col w-full h-full items-center">
    <div
      class="uppercase mt-10 text-base font-bold py-2 text-teal-700 max-w-lg w-full text-center"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      New Commanders
    </div>
    <div class="flex flex-col lg:flex-row w-full gap-2">
      <div class="overflow-x-auto mt-10 lg:w-1/2 max-w-4xl lg:max-h-96">
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
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody class="">
                <tr
                  v-for="c of commanders"
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
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ c.id }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ c.rarity + 1 }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ c.isGenesis ? commander.bonus + '% WR' : 'N/A' }}
                  </td>
                  <td @click.stop="emit('add-commander', c)">
                    <button title="Add Member">
                      <FontAwesomeIcon
                        :icon="['fas', 'user-plus']"
                        size="lg"
                        class="text-teal-700"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto mt-10 lg:w-1/2 max-w-4xl lg:max-h-96">
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
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody class="">
                <tr
                  v-for="c of newCommanders"
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
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ c.id }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ c.rarity + 1 }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ c.isGenesis ? commander.bonus + '% WR' : 'N/A' }}
                  </td>
                  <td @click.stop="emit('remove-commander', c.id)">
                    <button title="Remove Member">
                      <FontAwesomeIcon
                        :icon="['fas', 'times']"
                        size="lg"
                        class="text-red-700"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div
      class="uppercase mt-10 text-base font-bold py-2 text-teal-700 max-w-lg w-full text-center"
      style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
    >
      New Knights
    </div>
    <div class="flex flex-col lg:flex-row w-full gap-2">
      <div class="overflow-x-auto mt-10 lg:w-1/2 max-w-4xl lg:max-h-96">
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
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody class="">
                <tr
                  v-for="k of knights"
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
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ k.id }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ k.rarity + 1 }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{
                      k.isGenesis
                        ? `${k.combatPower} + ${knight.bonus}`
                        : k.combatPower
                    }}
                  </td>
                  <td @click.stop="emit('add-knight', k)">
                    <button title="Add Member">
                      <FontAwesomeIcon
                        :icon="['fas', 'user-plus']"
                        size="lg"
                        class="text-teal-700"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto mt-10 lg:w-1/2 max-w-4xl lg:max-h-96">
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
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody class="">
                <tr
                  v-for="k of newKnights"
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
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ k.id }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{ k.rarity + 1 }}
                  </td>
                  <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                    {{
                      k.isGenesis
                        ? `${k.combatPower} + ${knight.bonus}`
                        : k.combatPower
                    }}
                  </td>
                  <td @click.stop="emit('remove-knight', k.id)">
                    <button title="Remove Member">
                      <FontAwesomeIcon
                        :icon="['fas', 'times']"
                        size="lg"
                        class="text-red-700"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2 mt-10">
      <PrimaryButton
        v-if="commanderApproved && knightApproved"
        @click="emit('submit')"
        >SUBMIT</PrimaryButton
      >
      <PrimaryButton
        v-if="!commanderApproved"
        @click="setApprovalForAll('commander')"
        >APPROVE COMMANDER</PrimaryButton
      >
      <PrimaryButton v-if="!knightApproved" @click="setApprovalForAll('knight')"
        >APPROVE KNIGHT</PrimaryButton
      >
      <SecondaryButton @click="emit('close', false)">CLOSE</SecondaryButton>
    </div>
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

<script setup lang="ts">
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
  } from '@headlessui/vue'
  import { PropType, ref } from 'vue'
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'
  import { useMain } from '../stores/main-store'
  import { useContract } from '../stores/contract-store'
  import type { CharacterCommon } from '../types/common'
  import type { Knight } from '../types/knight'
  import type { Commander } from '../types/Commander'

  import SecondaryButton from './SecondaryButton.vue'
  import PrimaryButton from './PrimaryButton.vue'
  import NFTCard from './NFTCard.vue'
  const commander = useCommander()
  const knight = useKnight()
  const main = useMain()
  const contract = useContract()
  const selected = ref<CharacterCommon>()
  const selectedNft = ref('')

  const dialog = ref(false)

  defineProps({
    commanders: {
      type: Array as PropType<Commander[]>,
      required: true,
    },
    knights: {
      type: Array as PropType<Knight[]>,
      required: true,
    },
    newCommanders: {
      type: Array as PropType<Commander[]>,
      required: true,
    },
    newKnights: {
      type: Array as PropType<Knight[]>,
      required: true,
    },
  })

  const closeModal = () => {
    dialog.value = false
  }

  const emit = defineEmits([
    'close',
    'add-commander',
    'remove-commander',
    'add-knight',
    'remove-knight',
    'submit',
  ])

  const setApprovalForAll = async (nft: string) => {
    try {
      main.loading = true
      let res
      if (nft === 'knight') {
        res = await knight.setApprovalForAll(contract.game.address)
        await res.wait()
        await getKnightApproved()
      } else {
        res = await commander.setApprovalForAll(contract.game.address)
        await res.wait()
        await getCommanderApproved()
      }
    } catch (error) {
      console.log(error)
    } finally {
      main.loading = false
    }
  }

  const commanderApproved = ref(false)
  const knightApproved = ref(false)

  const getCommanderApproved = async () => {
    commanderApproved.value = await commander.isApprovedForAll(
      contract.game.address
    )
  }

  const getKnightApproved = async () => {
    knightApproved.value = await knight.isApprovedForAll(contract.game.address)
  }

  getCommanderApproved()
  getKnightApproved()
</script>

<style scoped></style>
