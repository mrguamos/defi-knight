<template>
  <div class="flex flex-col h-full pb-10">
    <NFTList :items="knights" nft="knights" class="mb-10" mode="market" />
    <div class="grow"></div>
    <GridPagination
      v-model="page"
      :length="knights.length"
      :total-visible="totalVisible"
      :pages-number="pagesNumber"
      :rows-per-page="rowsPerPage"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useAccount } from '../stores/account-store'
  import { Knight } from '../types/knight'
  import GridPagination from '../components/GridPagination.vue'
  import NFTList from '../components/NFTList.vue'

  import { useMarket } from '../stores/market-store'
  import { useMain } from '../stores/main-store'

  const dialog = ref(false)
  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const account = useAccount()
  const knights = ref<Knight[]>([])
  const market = useMarket()
  const main = useMain()
  const count = ref(0)

  main.$subscribe(async (_, state) => {
    if (state.refresh) {
      getKnights()
    }
  })

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      await getKnights()
    } else {
      knights.value = []
    }
  })

  const closeModal = () => {
    dialog.value = false
  }

  const getKnights = async () => {
    if (account.isConnected) {
      try {
        main.loading = true
        const data = (await market.getKnights(page.value - 1, rowsPerPage)).data
        knights.value = data.rows
        count.value = data.count

        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        main.loading = false
      }
    }
  }
  getKnights()

  const pagesNumber = computed(() => Math.ceil(count.value / rowsPerPage))
</script>
