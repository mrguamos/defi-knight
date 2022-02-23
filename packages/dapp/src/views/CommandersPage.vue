<template>
  <div class="flex grow flex-col">
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
    <PrimaryButton class="self-center mt-2" @click="mintCommander()"
      >MINT COMMANDER</PrimaryButton
    >
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useCommander } from '../stores/commander-store'
  import { useAccount } from '../stores/account-store'
  import { Commander } from '../types/commander'
  import BN from 'bn.js'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import GridPagination from '../components/GridPagination.vue'
  import DefiSpinner from '../components/DefiSpinner.vue'
  import NFTList from '../components/NFTList.vue'

  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const commander = useCommander()
  const account = useAccount()
  const loading = ref(false)
  const snackbar = ref(false)
  const snackbarText = ref('')
  const commanders = ref<Commander[]>([])
  const overlay = ref(false)

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      await getCommanders()
    } else {
      commanders.value = []
    }
  })

  const mintCommander = async () => {
    try {
      loading.value = true
      await commander.mintCommander()
      snackbarText.value = 'Success'
      snackbar.value = true
      commanders.value.push(await getCommander())
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

  const getCommander = async () => {
    const tokenId: number = parseInt(
      await commander.getLastIndexCommander(),
      10
    )
    const c = await commander.getCommander(tokenId)
    return { ...c, id: tokenId }
  }

  const getCommanders = async () => {
    if (account.isConnected) {
      try {
        overlay.value = true
        const tokens: BN[] = await commander.getCommanders()
        commanders.value = await Promise.all(
          tokens.map(async (token) => {
            const id = Number(token.toString())
            const c = await commander.getCommander(id)
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
  getCommanders()

  const pagesNumber = computed(() =>
    Math.ceil(commanders.value.length / rowsPerPage)
  )

  const paginatedCommanders = computed(() => {
    const start = (page.value - 1) * rowsPerPage
    return commanders.value.slice(start, start + rowsPerPage)
  })
</script>
