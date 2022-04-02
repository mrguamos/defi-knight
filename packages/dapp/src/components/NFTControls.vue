<template>
  <div v-if="mode === 'inventory'">
    <div v-if="market.isApproved" class="flex justify-between">
      <button
        class="text-[#9ba1fd] inline-flex items-center"
        @click="openDialog(1)"
      >
        <FontAwesomeIcon :icon="['fas', 'gift']" size="lg" />
      </button>
      <button
        class="text-[#9ba1fd] inline-flex items-center"
        @click="openDialog(2)"
      >
        <FontAwesomeIcon :icon="['fas', 'coins']" size="lg" />
      </button>
    </div>
    <div v-if="!market.isApproved" class="flex justify-center">
      <PrimaryButton @click="approveForAll()">APPROVE</PrimaryButton>
    </div>
  </div>
  <div v-if="mode === 'market'">
    <div v-if="hasAllowance" class="flex justify-between">
      <button class="text-[#9ba1fd] inline-flex items-center">
        <FontAwesomeIcon
          :icon="['fas', 'ban']"
          size="lg"
          @click="openDialog(1)"
        />
      </button>
      <button class="text-[#9ba1fd] inline-flex items-center">
        <FontAwesomeIcon
          :icon="['fas', 'shopping-cart']"
          size="lg"
          @click="openDialog(2)"
        />
      </button>
    </div>
    <div v-if="!hasAllowance" class="flex justify-center">
      <PrimaryButton @click="approveDK()">APPROVE</PrimaryButton>
    </div>
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
            v-if="mode === 'inventory' && action == 2"
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
                class="text-center text-sm font-medium text-teal-700"
              >
                SELL NFT
              </DialogTitle>
              <div class="flex grow flex-col text-sm gap-4 mt-5">
                <DKIcon class="w-8 h-8 self-center" />
                <input
                  v-model="amount"
                  class="text-black appearance-none border rounded-lg focus:outline-none focus:border-gray-500"
                  type="number"
                  placeholder="Amount"
                />
                <div class="flex justify-center gap-4 text-sm text-white">
                  <PrimaryButton @click="sell(item.id, amount)">
                    SUBMIT</PrimaryButton
                  >
                  <SecondaryButton c @click="closeModal()">
                    CANCEL</SecondaryButton
                  >
                </div>
              </div>
            </div>
          </TransitionChild>
          <TransitionChild
            v-if="mode === 'market' && action == 2"
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
                class="text-center text-sm font-medium text-teal-700"
              >
                BUY NFT
              </DialogTitle>
              <div class="flex grow flex-col text-sm gap-4 mt-5">
                <div class="flex justify-center text-lg items-center mb-2">
                  {{ main.getEthAmount(item.amount) }} DK
                  <DKIcon class="w-8 h-8 ml-1" />
                </div>
                <div class="flex justify-center gap-4 text-sm text-white">
                  <PrimaryButton @click="buy(item.id, item.amount)">
                    SUBMIT</PrimaryButton
                  >
                  <SecondaryButton c @click="closeModal()">
                    CANCEL</SecondaryButton
                  >
                </div>
              </div>
            </div>
          </TransitionChild>

          <TransitionChild
            v-if="mode === 'inventory' && action == 1"
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="w-full inline-block max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <DialogTitle
                as="h3"
                class="text-center text-sm font-medium text-teal-700"
              >
                TRANSFER NFT
              </DialogTitle>
              <div class="flex grow flex-col text-sm gap-4 mt-5">
                <input
                  v-model="to"
                  class="text-black appearance-none border rounded-lg focus:outline-none focus:border-gray-500 w-full"
                  type="text"
                  placeholder="Address"
                />
                <div class="flex justify-center gap-4 text-sm text-white">
                  <PrimaryButton @click="transfer(to, item.id)">
                    SUBMIT</PrimaryButton
                  >
                  <SecondaryButton c @click="closeModal()">
                    CANCEL</SecondaryButton
                  >
                </div>
              </div>
            </div>
          </TransitionChild>

          <TransitionChild
            v-if="mode === 'market' && action == 1"
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
                class="text-center text-sm font-medium text-teal-700"
              >
                CANCEL LISTING
              </DialogTitle>
              <div class="flex grow flex-col text-sm gap-4 mt-5">
                <DKIcon class="w-8 h-8 self-center" />
                <div class="flex justify-center gap-4 text-sm text-white">
                  <PrimaryButton @click="cancel(item.id)">
                    SUBMIT</PrimaryButton
                  >
                  <SecondaryButton c @click="closeModal()">
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
</template>

<script lang="ts" setup>
  import { PropType, ref } from 'vue'
  import type { Common } from '../types/common'
  import { useMarket } from '../stores/market-store'
  import { useCommander } from '../stores/commander-store'
  import { useKnight } from '../stores/knight-store'
  import { useGuild } from '../stores/guild-store'
  import { useAccount } from '../stores/account-store'
  import { useMain } from '../stores/main-store'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'
  import PrimaryButton from './PrimaryButton.vue'
  import SecondaryButton from './SecondaryButton.vue'
  import DKIcon from './DKIcon.vue'
  import { useContract } from '../stores/contract-store'

  const market = useMarket()
  const dialog = ref(false)
  const amount = ref()
  const commander = useCommander()
  const knight = useKnight()
  const guild = useGuild()
  const account = useAccount()
  const hasAllowance = ref(false)
  const main = useMain()
  const to = ref('')
  const action = ref(0)

  const props = defineProps({
    mode: {
      type: String,
      required: true,
    },
    item: {
      type: Object as PropType<Common>,
      required: true,
    },
    nft: {
      type: String,
      required: true,
    },
  })

  const openDialog = async (_action?: number) => {
    dialog.value = true
    if (_action) {
      action.value = _action
    }
  }

  const closeModal = () => {
    dialog.value = false
  }

  const sell = async (tokenId: number, amount: number) => {
    try {
      let nftType
      main.loading = true

      if (props.nft === 'commanders') {
        nftType = 0
      } else if (props.nft === 'knights') {
        nftType = 1
      } else if (props.nft === 'guilds') {
        nftType = 2
      }

      const res = await market.sell(nftType as number, tokenId, amount)
      const receipt = await res.wait()
      console.log(receipt)
      main.refresh = true
    } finally {
      main.loading = false
      closeModal()
    }
  }

  const cancel = async (tokenId: number) => {
    try {
      let nftType
      main.loading = true

      if (props.nft === 'commanders') {
        nftType = 0
      } else if (props.nft === 'knights') {
        nftType = 1
      } else if (props.nft === 'guilds') {
        nftType = 2
      }

      const res = await market.cancel(nftType as number, tokenId)
      const receipt = await res.wait()
      console.log(receipt)
      main.refresh = true
    } finally {
      main.loading = false
      closeModal()
    }
  }

  const buy = async (tokenId: number, amount: string) => {
    try {
      let nftType
      main.loading = true

      if (props.nft === 'commanders') {
        nftType = 0
      } else if (props.nft === 'knights') {
        nftType = 1
      } else if (props.nft === 'guilds') {
        nftType = 2
      }

      const res = await market.buy(nftType as number, tokenId, amount)
      const receipt = await res.wait()
      console.log(receipt)
      main.refresh = true
    } finally {
      main.loading = false
      closeModal()
    }
  }

  const approveForAll = async () => {
    try {
      main.loading = true
      let res
      if (props.nft === 'commanders')
        res = await commander.setApprovalForAll(useContract().market.address)
      else if (props.nft === 'knights')
        res = await knight.setApprovalForAll(useContract().market.address)
      else if (props.nft === 'guilds')
        res = await guild.setApprovalForAll(useContract().market.address)
      const receipt = await res.wait()
      market.isApproved = true
      console.log(receipt)
    } finally {
      main.loading = false
    }
  }

  const approveDK = async () => {
    try {
      main.loading = true
      const res = await account.approveDK(useContract().market.address)
      const receipt = await res.wait()
      console.log(receipt)
      getAllowance()
      // eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.code !== 4001) {
        //
      }
    } finally {
      main.loading = false
    }
  }

  const getAllowance = async () => {
    if (account.isConnected) {
      const allowance = await account.getDKAllowance(
        useContract().market.address
      )
      if (allowance.isZero()) {
        hasAllowance.value = false
        return
      }
      hasAllowance.value = true
    }
  }

  getAllowance()

  const transfer = async (address: string, tokenId: number) => {
    try {
      main.loading = true
      let res

      if (props.nft === 'commanders') {
        res = await commander.safeTransferFrom(address, tokenId)
      } else if (props.nft === 'knights') {
        res = await knight.safeTransferFrom(address, tokenId)
      } else if (props.nft === 'guilds') {
        res = await guild.safeTransferFrom(address, tokenId)
      }

      const receipt = await res.wait()
      console.log(receipt)
      main.refresh = true
    } finally {
      main.loading = false
      closeModal()
    }
  }
</script>
