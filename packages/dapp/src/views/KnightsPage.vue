<template>
  <div class="flex grow flex-col">
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
    <PrimaryButton class="self-center mt-2" @click="mintKnight()"
      >MINT KNIGHT</PrimaryButton
    >
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useKnight } from '../stores/knight-store'
  import { useAccount } from '../stores/account-store'
  import { Knight } from '../types/knight'
  import BN from 'bn.js'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import GridPagination from '../components/GridPagination.vue'
  import DefiSpinner from '../components/DefiSpinner.vue'
  import NFTList from '../components/NFTList.vue'

  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const knight = useKnight()
  const account = useAccount()
  const loading = ref(false)
  const snackbar = ref(false)
  const snackbarText = ref('')
  const knights = ref<Knight[]>([])
  const overlay = ref(false)

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      await getKnights()
    } else {
      knights.value = []
    }
  })

  const mintKnight = async () => {
    try {
      loading.value = true
      await knight.mintKnight()
      snackbarText.value = 'Success'
      snackbar.value = true
      knights.value.push(await getKnight())
      // eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.code !== 4001) {
        snackbarText.value = 'Something went wrong'
      }
    } finally {
      loading.value = false
    }
  }

  const getKnight = async () => {
    const tokenId: number = parseInt(await knight.getLastIndexKnight(), 10)
    const c = await knight.getKnight(tokenId)
    return { ...c, id: tokenId }
  }

  const getKnights = async () => {
    if (account.isConnected) {
      try {
        overlay.value = true
        const tokens: BN[] = await knight.getKnights()
        knights.value = await Promise.all(
          tokens.map(async (token) => {
            const id = Number(token.toString())
            const c = await knight.getKnight(id)
            return { ...c, id: id }
          })
        )

        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        overlay.value = false
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
</script>
