<template>
  <div class="flex flex-col h-full pb-10">
    <NFTList
      :items="paginatedCommanders"
      nft="commanders"
      class="mb-10"
      mode="market"
    />
    <div class="grow"></div>
    <GridPagination
      v-model="page"
      :length="commanders.length"
      :total-visible="totalVisible"
      :pages-number="pagesNumber"
      :rows-per-page="rowsPerPage"
    />

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
                class="inline-block w-auto max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-r to-[#040a34] from-gray-900 border-2 border-gray-700 shadow-xl rounded-lg"
              >
                <DialogTitle
                  as="h3"
                  class="text-center text-sm font-medium text-yellow-300"
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
                    <PrimaryButton> SUBMIT</PrimaryButton>

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
  import { useAccount } from '../stores/account-store'
  import { Commander } from '../types/commander'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import GridPagination from '../components/GridPagination.vue'
  import NFTList from '../components/NFTList.vue'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import DKIcon from '../components/DKIcon.vue'
  import BNBIcon from '../components/BNBIcon.vue'
  import { useMarket } from '../stores/market-store'
  import { useMain } from '../stores/main-store'

  const dialog = ref(false)
  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const account = useAccount()
  const commanders = ref<Commander[]>([])
  const mintFee = ref(0)
  const presaleFee = ref(0)
  const isPresale = ref(false)
  const stableFee = ref(0)
  const market = useMarket()
  const main = useMain()
  const count = ref(0)

  main.$subscribe(async (_, state) => {
    if (state.refresh) {
      getCommanders()
      state.refresh = false
    }
  })

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      await getCommanders()
    } else {
      commanders.value = []
    }
  })

  const closeModal = () => {
    dialog.value = false
  }

  const getCommanders = async () => {
    if (account.isConnected) {
      try {
        main.loading = true
        const queryParams = {}
        const data = (
          await market.getCommanders(page.value - 1, rowsPerPage, queryParams)
        ).data
        commanders.value = data.rows
        count.value = data.count
        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        main.loading = false
      }
    }
  }
  getCommanders()

  const pagesNumber = computed(() => Math.ceil(count.value / rowsPerPage))

  const paginatedCommanders = computed(() => {
    const start = (page.value - 1) * rowsPerPage
    return commanders.value.slice(start, start + rowsPerPage)
  })
</script>
