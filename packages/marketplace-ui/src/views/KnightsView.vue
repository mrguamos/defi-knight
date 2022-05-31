<script setup lang="ts">
  import KnightsComponent from '../components/KnightsComponent.vue'
  import { useKnight } from '../stores/knight-store'
  import { useAccount } from '../stores/account-store'
  import { useMain } from '../stores/main-store'
  useMain().nft = 'knights'

  const knight = useKnight()
  const account = useAccount()

  const search = async () => {
    if (account.isConnected) {
      try {
        const tokens = await knight.getKnights()
        knight.list = await Promise.all(
          tokens.map(async (token) => {
            const id = Number(token.toString())
            const c = (await knight.getKnight(id))[0]
            return { ...c, id: id }
          })
        )

        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        //
      }
    }
  }
</script>

<template>
  <KnightsComponent mode="sell">
    <template v-slot:search-button>
      <button
        @click="search()"
        class="uppercase border-2 border-teal-700 rounded-lg p-2 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
      >
        Search
      </button>
    </template></KnightsComponent
  >
</template>
