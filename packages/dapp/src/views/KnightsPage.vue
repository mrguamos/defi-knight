<template>
  <div class="flex flex-col h-full pb-10">
    <DefiSpinner v-if="loading" />
    <NFTList
      :items="paginatedKnights"
      nft="knights"
      class="mb-10"
      mode="inventory"
    />
    <div class="grow"></div>
    <GridPagination
      v-model="page"
      :length="knights.length"
      :total-visible="totalVisible"
      :pages-number="pagesNumber"
      :rows-per-page="rowsPerPage"
    />
    <PrimaryButton class="self-center mt-2" @click="openDialog()"
      >MINT KNIGHT</PrimaryButton
    >

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
                class="inline-block w-auto max-w-[500px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-r to-[#040a34] from-gray-900 border-2 border-gray-700 shadow-xl rounded-lg"
              >
                <DialogTitle
                  as="h3"
                  class="text-center text-md font-medium text-yellow-300"
                >
                  <div
                    v-if="!isPresale"
                    class="flex justify-center items-center"
                  >
                    {{ mintFee }} DK
                    <DKIcon class="w-10 h-10" />

                    + 30 BUSD <BUSDIcon class="h-6 w-6 ml-2" />
                  </div>
                  <div
                    v-if="isPresale"
                    class="flex justify-center items-center"
                  >
                    {{ presaleFee }} BNB
                    <BNBIcon class="w-8 h-8 ml-1 mr-1" />
                  </div>
                </DialogTitle>
                <div class="flex grow flex-col text-sm gap-4 mt-5">
                  <div class="flex justify-center gap-4 text-sm text-white">
                    <PrimaryButton @click="mintKnight()"> SUBMIT</PrimaryButton>

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
  import { useKnight } from '../stores/knight-store'
  import { useAccount } from '../stores/account-store'
  import { Knight } from '../types/knight'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import GridPagination from '../components/GridPagination.vue'
  import DefiSpinner from '../components/DefiSpinner.vue'
  import NFTList from '../components/NFTList.vue'
  import { ethers, BigNumberish } from 'ethers'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import DKIcon from '../components/DKIcon.vue'
  import BUSDIcon from '../components/BUSDIcon.vue'
  import BNBIcon from '../components/BNBIcon.vue'

  const dialog = ref(false)
  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const knight = useKnight()
  const account = useAccount()
  const loading = ref(false)
  const knights = ref<Knight[]>([])
  const mintFee = ref(0)
  const presaleFee = ref(0)
  const isPresale = ref(false)

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      await getKnights()
    } else {
      knights.value = []
    }
  })

  const openDialog = async () => {
    const res = await Promise.all([knight.getMintFee(), knight.getPresaleFee()])
    mintFee.value = res[0]
    presaleFee.value = Number(
      ethers.utils.formatUnits(res[1].toString(), 'ether')
    )
    dialog.value = true
  }

  const closeModal = () => {
    dialog.value = false
  }
  const mintKnight = async () => {
    try {
      loading.value = true
      const res = await knight.mintKnight()
      const receipt = await res.wait()
      for (const log of receipt.logs) {
        const data = knight.iKnight.parseLog(log)
        if (data.name === 'NewKnight') {
          const item = (await knight.getKnight(data.args[0]))[0]
          if (item) {
            knights.value.push({
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

  const getKnights = async () => {
    if (account.isConnected) {
      try {
        loading.value = true
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
        loading.value = false
      }
    }
  }
  getKnights()

  const pagesNumber = computed(() =>
    Math.ceil(knights.value.length / rowsPerPage)
  )

  const paginatedKnights = computed(() => {
    const start = (page.value - 1) * rowsPerPage
    return knights.value.slice(start, start + rowsPerPage)
  })

  knight.isPresale().then((res) => {
    isPresale.value = res
  })
</script>
