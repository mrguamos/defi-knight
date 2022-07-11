<template>
  <div class="flex flex-col w-full items-center gap-10 pb-10">
    <div
      class="grid grid-cols-1 gap-10 md:grid-cols-2 max-w-7xl w-full bg-black/20 p-5 rounded-lg"
    >
      <MiniCharacter
        nft="Commanders"
        :items="commanders"
        @view-item="viewItem"
      />

      <MiniCharacter
        nft="New Commanders"
        :items="newCommanders"
        @view-item="viewItem"
      />
    </div>
    <div
      class="grid grid-cols-1 gap-10 md:grid-cols-2 max-w-7xl w-full mt-14 bg-black/20 p-5 rounded-lg"
    >
      <MiniCharacter nft="Knights" :items="knights" @view-item="viewItem" />

      <MiniCharacter
        nft="New Knights"
        :items="newKnights"
        @view-item="viewItem"
      />
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
              <DialogOverlay class="fixed inset-0 bg-black/90" />
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
                class="inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform rounded-md"
              >
                <div class="flex flex-col text-sm gap-4">
                  <div class="flex justify-center items-center">
                    <NFTCard
                      :nft="
                        selectedNft.toLowerCase().includes('commanders')
                          ? 'commanders'
                          : 'knights'
                      "
                      :item="selected"
                      :mode="'inventory'"
                    />
                  </div>
                  <div
                    class="flex justify-center gap-4 text-sm text-white mt-2"
                  >
                    <button
                      v-if="selectedNft.toLowerCase().includes('new')"
                      class="border-2 border-red-700 p-2 rounded-lg"
                      @click="removeItem(selected)"
                    >
                      REMOVE
                    </button>
                    <PrimaryButton v-else @click="addItem(selected)">
                      ADD</PrimaryButton
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
  import MiniCharacter from './MiniCharacter.vue'

  const commander = useCommander()
  const knight = useKnight()
  const main = useMain()
  const contract = useContract()
  const selected = ref<CharacterCommon>(undefined as unknown as CharacterCommon)
  const selectedNft = ref('')

  const dialog = ref(false)

  const addItem = (item: CharacterCommon) => {
    if (item) {
      try {
        if (selectedNft.value.includes('commanders')) {
          emit('add-commander', item)
          return
        }
        emit('add-knight', item)
      } finally {
        closeModal()
      }
    }
  }

  const removeItem = (item: CharacterCommon) => {
    if (item) {
      try {
        if (selectedNft.value.includes('commanders')) {
          emit('remove-commander', item)
          return
        }
        emit('remove-knight', item)
      } finally {
        closeModal()
      }
    }
  }

  const viewItem = (item: CharacterCommon, nft: string) => {
    selectedNft.value = nft.toLowerCase()
    selected.value = item
    dialog.value = true
  }

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
