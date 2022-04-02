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
  import { useAccount } from '../stores/account-store'
  import { Commander } from '../types/commander'
  import GridPagination from '../components/GridPagination.vue'
  import NFTList from '../components/NFTList.vue'
  import { useMarket } from '../stores/market-store'
  import { useMain } from '../stores/main-store'

  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const account = useAccount()
  const commanders = ref<Commander[]>([])
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
</script>
