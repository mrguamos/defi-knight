<script setup lang="ts">
  import { ref } from 'vue'
  import FilterComponent from '../components/FilterComponent.vue'
  import ResultComponent from '../components/ResultComponent.vue'
  import CharacterFilter from '../components/CharacterFilter.vue'
  import { useCommander } from '../stores/commander-store'
  import NFTCard from './NFTCard.vue'
  import CharacterAttributes from './CharacterAttributes.vue'
  import { XCircleIcon } from '@heroicons/vue/solid'
  import { PencilIcon } from '@heroicons/vue/solid'
  import { useMarket } from '../stores/market-store'
  import { useAccount } from '../stores/account-store'
  import { useMain } from '../stores/main-store'
  import type { CommanderMarket } from '../types/market'

  import DialogComponent from './DialogComponent.vue'
  import GridPagination from './GridPagination.vue'

  const commander = useCommander()
  const market = useMarket()

  const account = useAccount()
  const main = useMain()
  const editDialog = ref(false)
  const tokenId = ref(0)

  const price = ref('0')
  const newPrice = ref('')
  const totalVisible = 3
  const rowsPerPage = 2

  const edit = async () => {
    try {
      main.loading = true
      const res = await market.edit(0, tokenId.value, newPrice.value.toString())
      await res.wait()
    } catch (error) {
      //
    } finally {
      main.loading = false
      closeEditModal()
    }
  }

  const cancel = async (id: number) => {
    try {
      main.loading = true
      const res = await market.cancel(0, id)
      await res.wait()
    } catch (error) {
      //
    } finally {
      main.loading = false
    }
  }

  const openEditDialog = async (_tokenId: number, _price: string) => {
    editDialog.value = true
    tokenId.value = _tokenId
    price.value = _price
  }

  const closeEditModal = () => {
    editDialog.value = false
  }

  const search = async (page: number) => {
    useMain().loading = true
    commander.list.data = []
    commander.list.currentPage = page
    if (account.isConnected) {
      try {
        const queryParams: Record<string, string> = {
          address: account.address,
          offset: ((page - 1) * rowsPerPage).toString(),
          listed: '1',
          limit: rowsPerPage.toString(),
        }
        commander.bonus = await commander.getBonus()
        const res = await commander.listedCommanders(queryParams)
        commander.list.data = res.data.rows
        commander.list.total = res.data.count
      } catch (e: unknown) {
        //
      } finally {
        useMain().loading = false
      }
    }
  }
</script>

<template>
  <div class="flex h-full">
    <DialogComponent v-model="editDialog">
      <template v-slot:title>
        <span
          >Edit Commander #
          <span class="text-teal-700">{{ tokenId }}</span></span
        >
      </template>
      <template v-slot:content>
        <div
          class="flex flex-col text-sm gap-4 w-full justify-center items-center"
        >
          <label for="price" class="text-sm font-semibold">Price</label>
          <span id="price" class="font-semibold text-lg text-blue-400"
            >{{ main.getEthAmount(price) }} BNB</span
          >
          <label for="price" class="text-sm font-semibold">New Price BNB</label>
          <input
            type="number"
            id="price"
            class="text-black rounded-lg"
            v-model="newPrice"
          />
          <div class="flex justify-center gap-4 text-sm text-white">
            <button
              class="uppercase p-2 border border-teal-700 rounded-lg"
              @click="edit()"
            >
              Submit
            </button>
            <button
              @click="closeEditModal()"
              class="uppercase p-2 border border-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </DialogComponent>

    <FilterComponent
      ><CharacterFilter> </CharacterFilter>
      <template v-slot:search-button>
        <button
          @click="search(1)"
          class="uppercase border-2 border-teal-700 rounded-lg p-2 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
        >
          Search
        </button>
      </template>
    </FilterComponent>
    <ResultComponent>
      <div class="flex flex-col grow justify-center w-full p-5">
        <div
          class="grow h-full grid grid-cols-1 result-sm:grid-cols-2 result-md:grid-cols-3 result-lg:grid-cols-4 result-xl:grid-cols-5 result-2xl:grid-cols-6 gap-7 w-full"
        >
          <div
            v-for="item of commander.list.data"
            :key="item.id"
            class="h-min text-white flex justify-center px-5 md:px-0"
          >
            <NFTCard
              :item="item"
              :imageURL="`commanders/${item.class}-${item.gender}-${item.rarity}.png`"
            >
              <div>
                <CharacterAttributes :item="item" nft="commanders" />
                <div class="border-b border-gray-500/50 w-full mt-4"></div>
                <div
                  class="flex items-center justify-between mt-4 text-base font-semibold text-blue-400"
                >
                  <span>Price</span>
                  <span
                    >{{ main.getEthAmount((item as CommanderMarket).amount)}}
                    BNB</span
                  >
                </div>
                <div class="flex justify-center items-center gap-10 mt-2">
                  <button
                    title="Edit"
                    @click="openEditDialog(item.id, (item as CommanderMarket).amount)"
                  >
                    <PencilIcon class="h-7 w-7 text-teal-700" />
                  </button>
                  <button title="Unlist" @click="cancel(item.id)">
                    <XCircleIcon class="h-7 w-7 text-teal-700" />
                  </button>
                </div>
              </div>
            </NFTCard>
          </div>
        </div>
        <div
          class="flex flex-col w-full justify-center mt-10"
          v-if="commander.list.data.length > 0"
        >
          <GridPagination
            v-model="commander.list.currentPage"
            :length="commander.list.total"
            :total-visible="totalVisible"
            :pages-number="commander.pagesNumber"
            :rows-per-page="rowsPerPage"
            @update:model-value="search"
          />
        </div>
      </div>
    </ResultComponent>
  </div>
</template>
