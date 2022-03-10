<template>
  <div class="flex flex-col h-full pb-10">
    <DefiSpinner v-if="loading" />
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
    <PrimaryButton class="self-center mt-2" @click="openDialog()"
      >MINT COMMANDER</PrimaryButton
    >
    <!-- <PrimaryButton
      v-if="!hasAllowance"
      class="self-center mt-2"
      @click="approveDK()"
      >APPROVE</PrimaryButton
    > -->

    <TransitionRoot appear :show="dialog" as="template">
      <Dialog as="div" @close="loading ? '' : closeModal()">
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
                class="inline-block w-auto max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-r to-[#040a34] from-gray-900 border-2 border-gray-700 shadow-xl rounded-lg"
              >
                <DialogTitle
                  as="h3"
                  class="text-center text-md font-medium text-yellow-300"
                >
                  <div
                    v-if="!isPresale"
                    class="flex justify-center items-center flex-col"
                  >
                    <div class="flex justify-center text-lg items-center mb-2">
                      {{ mintFee }} DK
                      <DKIcon class="w-8 h-8 ml-1" />
                    </div>
                    <FontAwesomeIcon
                      :icon="['fas', 'plus-circle']"
                      size="lg"
                      class="text-[#9ba1fd]"
                    />

                    <div class="flex justify-center text-lg items-center mt-2">
                      {{ stableFee }} BNB
                      <BNBIcon class="h-8 w-8 ml-1" />
                    </div>
                  </div>
                  <div
                    v-if="isPresale"
                    class="flex text-lg justify-center items-center"
                  >
                    {{ presaleFee }} BNB
                    <BNBIcon class="w-8 h-8 ml-1" />
                  </div>
                </DialogTitle>
                <div class="flex grow flex-col text-sm gap-4 mt-5">
                  <div class="flex justify-center gap-4 text-sm text-white">
                    <PrimaryButton @click="mintCommander()">
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
  import { useAccount } from '../stores/account-store'
  import { Commander } from '../types/commander'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import GridPagination from '../components/GridPagination.vue'
  import DefiSpinner from '../components/DefiSpinner.vue'
  import NFTList from '../components/NFTList.vue'
  import { ethers, BigNumberish } from 'ethers'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import DKIcon from '../components/DKIcon.vue'
  import BNBIcon from '../components/BNBIcon.vue'

  const dialog = ref(false)
  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const commander = useCommander()
  const priceManager = usePriceManager()
  const account = useAccount()
  const loading = ref(false)
  const commanders = ref<Commander[]>([])
  const mintFee = ref(0)
  const presaleFee = ref(0)
  const isPresale = ref(false)
  const stableFee = ref(0)
  const hasAllowance = ref(false)

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      await getCommanders()
    } else {
      commanders.value = []
    }
  })

  const openDialog = async () => {
    const res = await Promise.all([
      priceManager.getMintFee(),
      priceManager.getPresaleFee(),
      priceManager.getStableFee(),
      priceManager.isPresale(),
    ])
    mintFee.value = Number(ethers.utils.formatUnits(res[0].toString(), 'ether'))
    presaleFee.value = Number(
      ethers.utils.formatUnits(res[1].toString(), 'ether')
    )
    stableFee.value = Number(
      ethers.utils.formatUnits(res[2].toString(), 'ether')
    )
    isPresale.value = res[3]
    dialog.value = true
  }

  const closeModal = () => {
    dialog.value = false
  }
  const mintCommander = async () => {
    try {
      loading.value = true
      const res = await commander.mintCommander()
      const receipt = await res.wait()
      for (const log of receipt.logs) {
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
      }

      // eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.code !== 4001) {
        //
      }
    } finally {
      loading.value = false
      closeModal()
    }
  }

  const getCommanders = async () => {
    if (account.isConnected) {
      try {
        loading.value = true
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
        loading.value = false
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
      const allowance = await account.getDKAllowance()
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
      loading.value = true
      const res = await account.approveDK()
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
      loading.value = false
    }
  }
</script>
