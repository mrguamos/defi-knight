<script setup lang="ts">
  import { ref } from 'vue'
  import FilterComponent from '../components/FilterComponent.vue'
  import ResultComponent from '../components/ResultComponent.vue'
  import CharacterFilter from '../components/CharacterFilter.vue'
  import { useCommander } from '../stores/commander-store'
  import NFTCard from './NFTCard.vue'
  import CharacterAttributes from './CharacterAttributes.vue'
  import { GiftIcon } from '@heroicons/vue/solid'
  import { TagIcon } from '@heroicons/vue/solid'
  import { useMarket } from '../stores/market-store'
  import { useContract } from '../stores/contract-store'
  import { useAccount } from '../stores/account-store'
  import { useMain } from '../stores/main-store'
  import { isError } from '../utils/util'
  import DialogComponent from './DialogComponent.vue'
  import GridPagination from './GridPagination.vue'
  import type { Commander } from '../types/commander'
  import CommanderResetButton from './CommanderResetButton.vue'

  const commander = useCommander()
  const market = useMarket()
  const contract = useContract()
  const account = useAccount()
  const main = useMain()
  const giftDialog = ref(false)
  const sellDialog = ref(false)
  const tokenId = ref(0)
  const recipientAddress = ref('')
  const price = ref('0')
  const totalVisible = 3
  const rowsPerPage = 20

  const sell = async () => {
    try {
      main.loading = true
      const res = await market.sell(0, tokenId.value, price.value.toString())
      await res.wait()
      await search(1)
    } catch (error) {
      console.log(error)
    } finally {
      main.loading = false
      closeSellModal()
    }
  }

  const gift = async () => {
    try {
      main.loading = true
      const res = await commander.safeTransferFrom(
        recipientAddress.value,
        tokenId.value
      )
      await res.wait()
      await search(1)
    } catch (error) {
      //
    } finally {
      main.loading = false
      closeGiftModal()
    }
  }

  const setApprovalForAll = async () => {
    try {
      main.loading = true
      const res = await commander.setApprovalForAll(contract.market.address)
      await res.wait()
      await getApproved()
    } catch (error) {
      console.log(error)
      if (isError(error)) {
        if (error.code !== 4001) {
          //
        }
      }
    } finally {
      main.loading = false
    }
  }

  const getApproved = async () => {
    if (account.isConnected) {
      market.isApproved = await commander.isApprovedForAll(
        contract.market.address
      )
    }
  }

  getApproved()

  const openGiftDialog = async (_tokenId: number) => {
    giftDialog.value = true
    tokenId.value = _tokenId
    recipientAddress.value = ''
  }
  const openSellDialog = async (_tokenId: number) => {
    sellDialog.value = true
    tokenId.value = _tokenId
    price.value = '0'
  }
  const closeGiftModal = () => {
    giftDialog.value = false
  }
  const closeSellModal = () => {
    sellDialog.value = false
  }

  const search = async (page: number) => {
    useMain().loading = true
    commander.list.data = []
    commander.list.currentPage = page
    if (account.isConnected) {
      try {
        commander.bonus = await commander.getBonus()
        if (commander.filter.id) {
          const owner = await commander.ownerOf(commander.filter.id)
          if (owner.toLowerCase() === account.address.toLowerCase()) {
            const c = (await commander.getCommander(commander.filter.id))[0]
            commander.list.data = [
              {
                ...c,
                id: commander.filter.id,
              },
            ]
          }
        } else {
          const tokens = await commander.getCommanders()
          const list = await Promise.all(
            tokens.map(async (token) => {
              const id = Number(token.toString())
              const c = (await commander.getCommander(id))[0]
              return { ...c, id: id }
            })
          )
          commander.list.data = list.filter((item: Commander) => {
            let race = true
            if (commander.filter.race.length > 0) {
              race = commander.filter.race.includes(item.class)
            }
            let genesis = true
            if (commander.filter.genesis.length > 0) {
              genesis = commander.filter.genesis.includes(
                item.isGenesis ? 1 : 0
              )
            }
            const rarity =
              item.rarity >= commander.filter.min &&
              item.rarity <= commander.filter.max

            let gender = true
            if (commander.filter.gender.length > 0) {
              gender = commander.filter.gender.includes(item.gender)
            }

            return race && genesis && rarity && gender
          })
        }

        commander.list.total = commander.list.data.length
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
    <DialogComponent v-model="sellDialog">
      <template v-slot:title>
        <span
          >List Commander #
          <span class="text-teal-700">{{ tokenId }}</span></span
        >
      </template>
      <template v-slot:content>
        <div
          class="flex grow flex-col text-sm gap-4 w-full justify-center items-center"
        >
          <label for="price" class="text-sm font-semibold">Price BNB</label>
          <input
            type="number"
            id="price"
            class="text-black rounded-lg"
            v-model="price"
          />
          <div class="flex justify-center gap-4 text-sm text-white">
            <button
              class="uppercase p-2 border border-teal-700 rounded-lg"
              @click="sell()"
            >
              Submit
            </button>
            <button
              @click="closeSellModal()"
              class="uppercase p-2 border border-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </DialogComponent>
    <DialogComponent v-model="giftDialog">
      <template v-slot:title>
        <span
          >Transfer Commander #
          <span class="text-teal-700">{{ tokenId }}</span></span
        >
      </template>
      <template v-slot:content>
        <div
          class="flex flex-col text-sm gap-4 w-full justify-center items-center"
        >
          <label for="address" class="text-sm font-semibold">Address</label>
          <input
            type="text"
            id="address"
            class="text-black w-full rounded-lg"
            v-model="recipientAddress"
          />
          <div class="flex justify-center gap-4 text-sm text-white">
            <button
              class="uppercase p-2 border border-teal-700 rounded-lg"
              @click="gift()"
            >
              Submit
            </button>
            <button
              @click="closeGiftModal()"
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
      <template v-slot:control-buttons>
        <button
          @click="search(1)"
          class="uppercase border-2 border-teal-700 rounded-lg p-2 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
        >
          Search
        </button>
        <CommanderResetButton />
      </template>
    </FilterComponent>
    <ResultComponent>
      <div class="flex flex-col grow justify-center w-full p-5">
        <div
          class="grow h-full grid grid-cols-1 result-sm:grid-cols-2 result-md:grid-cols-3 result-lg:grid-cols-4 result-xl:grid-cols-5 result-2xl:grid-cols-6 gap-7 w-full"
        >
          <div
            v-for="item of commander.paginatedCommanders"
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
                <div class="flex justify-center items-center gap-10 mt-4">
                  <button
                    title="Gift"
                    v-if="market.isApproved"
                    @click="openGiftDialog(item.id)"
                  >
                    <GiftIcon class="h-7 w-7 text-teal-700" />
                  </button>
                  <button
                    title="Sell"
                    v-if="market.isApproved"
                    @click="openSellDialog(item.id)"
                  >
                    <TagIcon class="h-7 w-7 text-teal-700" />
                  </button>
                  <button
                    title="Approve"
                    @click="setApprovalForAll()"
                    v-if="!market.isApproved"
                    class="uppercase p-2 border border-teal-700 rounded-lg"
                  >
                    Approve
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
          />
        </div>
      </div>
    </ResultComponent>
  </div>
</template>
