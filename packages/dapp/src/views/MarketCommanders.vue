<template>
  <div class="flex flex-col h-full pb-10">
    <NFTList :items="commanders" nft="commanders" class="mb-10" mode="market" />
    <div class="grow"></div>
    <GridPagination
      v-model="page"
      :length="commanders.length"
      :total-visible="totalVisible"
      :pages-number="pagesNumber"
      :rows-per-page="rowsPerPage"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useAccount, AccountStore } from '../stores/account-store'
  import { useContract } from '../stores/contract-store'
  import { Commander } from '../types/commander'
  import GridPagination from '../components/GridPagination.vue'
  import NFTList from '../components/NFTList.vue'
  import { useMarket } from '../stores/market-store'
  import { useMain, MainStore } from '../stores/main-store'
  import { SubscriptionCallbackMutationPatchObject } from 'pinia'

  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const account = useAccount()
  const commanders = ref<Commander[]>([])
  const market = useMarket()
  const main = useMain()
  const count = ref(0)

  main.$subscribe(async (mutation, state) => {
    const { refresh } =
      (mutation as SubscriptionCallbackMutationPatchObject<MainStore>)
        .payload || false
    if (refresh) {
      getCommanders()
      state.refresh = false
    }
  })

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

  const getAllowance = async () => {
    if (account.isConnected) {
      const allowance = await account.getDKAllowance(
        useContract().market.address
      )
      if (allowance.isZero()) {
        market.hasAllowance = false
        return
      }
      market.hasAllowance = true
    }
  }

  getAllowance()
</script>
