<template>
  <div class="flex flex-col h-full pb-10">
    <NFTList
      :items="paginatedCommanders"
      nft="commanders"
      class="mb-10"
      mode="inventory"
    />
    <div class="grow"></div>
    <GridPagination
      v-model="page"
      :length="commanders.length"
      :total-visible="totalVisible"
      :pages-number="pagesNumber"
      :rows-per-page="rowsPerPage"
    />
    <PrimaryButton
      v-if="hasAllowance"
      class="self-center mt-2"
      @click="openDialog()"
      >MINT COMMANDER</PrimaryButton
    >
    <PrimaryButton
      v-if="!hasAllowance"
      class="self-center mt-2"
      @click="approveDK()"
      >APPROVE</PrimaryButton
    >
    <!-- <PrimaryButton
      v-if="!hasAllowance"
      class="self-center mt-2"
      @click="approveDK()"
      >APPROVE</PrimaryButton
    > -->

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
                class="inline-block w-auto max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <DialogTitle
                  as="h3"
                  class="text-center text-sm font-medium text-teal-700"
                >
                  <div class="flex justify-center items-center flex-col">
                    <div
                      class="flex justify-center text-lg items-center mb-1 text-white"
                    >
                      {{ mintFee }} DK
                      <DKIcon class="w-8 h-8 ml-1" />
                    </div>
                    <span class="text-red-500 text-2xl font-bold">+</span>

                    <div
                      class="flex justify-center text-lg items-center mt-1 text-white"
                    >
                      {{ stableFee }} BNB
                      <BNBIcon class="h-8 w-8 ml-1" />
                    </div>
                  </div>
                </DialogTitle>
                <div class="flex grow flex-col text-sm gap-4 mt-5">
                  <div class="flex justify-center gap-4 text-sm text-white">
                    <PrimaryButton @click="mintCommander()">
                      SUBMIT</PrimaryButton
                    >

                    <SecondaryButton @click="closeModal()">
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
</template>

<script lang="ts" setup>
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'
  import { ref, computed } from 'vue'
  import { useCommander } from '../stores/commander-store'
  import { usePriceManager } from '../stores/price-manager-store'
  import { useAccount, AccountStore } from '../stores/account-store'

  import { Commander } from '../types/commander'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import GridPagination from '../components/GridPagination.vue'
  import NFTList from '../components/NFTList.vue'
  import { ethers, BigNumberish } from 'ethers'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import DKIcon from '../components/DKIcon.vue'
  import BNBIcon from '../components/BNBIcon.vue'
  import { useContract } from '../stores/contract-store'
  import { useMain, MainStore } from '../stores/main-store'
  import { SubscriptionCallbackMutationPatchObject } from 'pinia'

  const dialog = ref(false)
  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 20
  const commander = useCommander()
  const priceManager = usePriceManager()
  const account = useAccount()
  const commanders = ref<Commander[]>([])
  const mintFee = ref(0)
  const stableFee = ref(0)
  const hasAllowance = ref(false)
  const main = useMain()

  account.$subscribe(async (mutation) => {
    const { isConnected } =
      (mutation as SubscriptionCallbackMutationPatchObject<AccountStore>)
        .payload || false
    if (isConnected) {
      getCommanders()
      getAllowance()
    } else {
      commanders.value = []
    }
  })

  main.$subscribe(async (mutation, state) => {
    const { refresh } =
      (mutation as SubscriptionCallbackMutationPatchObject<MainStore>)
        .payload || false
    if (refresh) {
      getCommanders()
      state.refresh = false
    }
  })

  const openDialog = async () => {
    const res = await Promise.all([
      priceManager.getMintFee(),
      priceManager.getStableFee(),
    ])
    mintFee.value = Number(ethers.utils.formatUnits(res[0].toString(), 'ether'))

    stableFee.value = Number(
      ethers.utils.formatUnits(res[1].toString(), 'ether')
    )
    dialog.value = true
  }

  const closeModal = () => {
    dialog.value = false
  }
  const mintCommander = async () => {
    try {
      main.loading = true
      const res = await commander.mintCommander()
      const receipt = await res.wait()
      for (const log of receipt.logs) {
        try {
          const data = commander.iCommander.parseLog(log)
          if (data.name === 'NewCommander') {
            const item = (await commander.getCommander(data.args[0]))[0]
            if (item) {
              commanders.value.push({
                ...item,
                id: (data.args[0] as BigNumberish).toString(),
              })
              return
            }
          }
        } catch (error) {
          //
        }
      }

      // eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.code !== 4001) {
        //
      }
    } finally {
      main.loading = false
      closeModal()
    }
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
  getCommanders()

  const pagesNumber = computed(() =>
    Math.ceil(commanders.value.length / rowsPerPage)
  )

  const paginatedCommanders = computed(() => {
    const start = (page.value - 1) * rowsPerPage
    return commanders.value.slice(start, start + rowsPerPage)
  })

  const getAllowance = async () => {
    if (account.isConnected) {
      const allowance = await account.getDKAllowance(useContract().game.address)
      if (allowance.isZero()) {
        hasAllowance.value = false
        return
      }
      hasAllowance.value = true
    }
  }

  getAllowance()

  const approveDK = async () => {
    try {
      main.loading = true
      const res = await account.approveDK(useContract().game.address)
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
</script>
