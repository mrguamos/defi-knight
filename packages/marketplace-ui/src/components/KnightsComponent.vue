<script setup lang="ts">
  import FilterComponent from '../components/FilterComponent.vue'
  import ResultComponent from '../components/ResultComponent.vue'
  import CharacterFilter from '../components/CharacterFilter.vue'
  import { useKnight } from '../stores/knight-store'
  import NFTCard from './NFTCard.vue'
  import CharacterAttributes from './CharacterAttributes.vue'
  import { GiftIcon } from '@heroicons/vue/solid'
  import { TagIcon } from '@heroicons/vue/solid'
  import { PencilIcon } from '@heroicons/vue/solid'
  import { XCircleIcon } from '@heroicons/vue/solid'
  import { CashIcon } from '@heroicons/vue/solid'

  const knight = useKnight()

  defineProps({
    mode: {
      type: String,
      required: true,
    },
  })
</script>

<template>
  <div class="flex h-full">
    <FilterComponent
      ><CharacterFilter> </CharacterFilter>
      <template v-slot:search-button>
        <slot name="search-button"></slot>
      </template>
    </FilterComponent>
    <ResultComponent>
      <div class="flex grow justify-center w-full p-5">
        <div
          class="grid grid-cols-1 result-sm:grid-cols-2 result-md:grid-cols-3 result-lg:grid-cols-4 result-xl:grid-cols-5 result-2xl:grid-cols-6 gap-7 w-full"
        >
          <div
            v-for="item of knight.list"
            :key="item.id"
            class="h-min text-white flex justify-center px-5 md:px-0"
          >
            <NFTCard
              :item="item"
              :imageURL="`knights/${item.class}-${item.gender}-${item.rarity}.png`"
            >
              <div>
                <CharacterAttributes :item="item" nft="knights" />
                <div class="border-b border-gray-500/50 w-full mt-4"></div>
                <div
                  class="flex justify-center items-center gap-10 mt-4"
                  v-if="mode === 'sell'"
                >
                  <button title="Gift">
                    <GiftIcon class="h-7 w-7 text-teal-700" />
                  </button>
                  <button title="Sell">
                    <TagIcon class="h-7 w-7 text-teal-700" />
                  </button>
                </div>
                <div
                  class="flex justify-center items-center gap-10 mt-4"
                  v-if="mode === 'listings'"
                >
                  <button title="Edit">
                    <PencilIcon class="h-7 w-7 text-teal-700" />
                  </button>
                  <button title="Unlist">
                    <XCircleIcon class="h-7 w-7 text-teal-700" />
                  </button>
                </div>
                <div
                  class="flex justify-center items-center mt-4"
                  v-if="mode === 'buy'"
                >
                  <button title="Buy">
                    <CashIcon class="h-7 w-7 text-teal-700" />
                  </button>
                </div>
              </div>
            </NFTCard>
          </div>
        </div>
      </div>
    </ResultComponent>
  </div>
</template>
