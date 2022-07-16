<template>
  <div>
    <TransitionRoot appear :show="modelValue" as="template">
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
                class="inline-block w-full max-w-lg p-6 text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <div
                  class="flex grow flex-col text-sm gap-4 items-center justify-center"
                >
                  <div class="w-full flex justify-center items-center flex-col">
                    <Carousel
                      :itemsToShow="itemsToShow"
                      :wrapAround="true"
                      ref="carousel"
                      v-show="showCarousel"
                      @update:modelValue="(value:number) => (currentSlide = value)"
                    >
                      <Slide v-for="slide in 12" :key="slide">
                        <div
                          class="carousel__item flex justify-center items-center"
                        >
                          <img
                            :src="getImageUrl(`emblems/${slide}.png`)"
                            class="w-36"
                          />
                        </div>
                      </Slide>
                      <template #addons>
                        <Navigation />
                      </template>
                    </Carousel>
                    <div
                      class="flex items-center justify-center w-full text-teal-700 font-medium text-lg"
                    >
                      {{ emblemFee }} DK
                      <DKIcon class="w-10 h-10 ml-1" />
                    </div>
                  </div>

                  <div
                    class="w-full flex justify-center items-center flex-col gap-2"
                  >
                    <Listbox v-model="selectedGuild" class="w-full" id="minR">
                      <div class="relative mt-1">
                        <ListboxButton
                          class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                          :class="{ 'text-center': !selectedGuild }"
                        >
                          <span class="block truncate text-black">{{
                            selectedGuild ? selectedGuild.id : 'SELECT GUILD'
                          }}</span>
                          <span
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                          >
                            <SelectorIcon
                              class="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </ListboxButton>

                        <transition
                          leave-active-class="transition duration-100 ease-in"
                          leave-from-class="opacity-100"
                          leave-to-class="opacity-0"
                        >
                          <ListboxOptions
                            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="r in filteredGuilds"
                              :key="r.id"
                              :value="r"
                              as="template"
                            >
                              <li
                                :class="[
                                  active
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-10 pr-4',
                                ]"
                              >
                                <span
                                  :class="[
                                    selected ? 'font-medium' : 'font-normal',
                                    'block truncate',
                                  ]"
                                  >{{ r.id }}</span
                                >
                                <span
                                  v-if="selected"
                                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                                >
                                  <CheckIcon
                                    class="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <div
                    class="flex justify-center gap-4 text-sm text-white mt-2"
                  >
                    <button
                      v-if="!hasAllowance"
                      @click="approveDK()"
                      class="uppercase border-2 border-teal-700 rounded-lg py-2 px-5 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
                    >
                      Approve
                    </button>
                    <button
                      v-if="hasAllowance"
                      @click="buyEmblem()"
                      class="uppercase border-2 border-teal-700 rounded-lg py-2 px-5 bg-transparent hover:bg-teal-600/50 active:border-transparent active:ring active:ring-teal-700"
                    >
                      Buy
                    </button>
                    <button
                      @click="closeModal()"
                      class="text-sm uppercase border-2 border-white rounded-lg p-2 bg-transparent hover:bg-white active:border-transparent active:ring active:ring-white hover:text-black"
                    >
                      Close
                    </button>
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

<script setup lang="ts">
  import 'vue3-carousel/dist/carousel.css'
  import { ref, onMounted, nextTick, computed } from 'vue'
  import { Carousel, Slide, Navigation } from 'vue3-carousel'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'
  import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'
  import { useMain } from '../stores/main-store'
  import { getImageUrl } from '@/utils/util'
  import { useGuild } from '@/stores/guild-store'
  import type { Guild } from '@/types/guild'
  import { useAccount } from '@/stores/account-store'
  import { useMarket } from '@/stores/market-store'
  import { usePriceManager } from '@/stores/price-manager-store'
  import { utils } from 'ethers'
  import DKIcon from './DKIcon.vue'
  import { useContract } from '@/stores/contract-store'

  const itemsToShow = ref(1)

  const showCarousel = ref(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const carousel = ref<any>(null)
  const currentSlide = ref(0)

  const main = useMain()
  const account = useAccount()
  const guild = useGuild()
  const guilds = ref<Guild[]>()
  const selectedGuild = ref<Guild>()

  const priceManager = usePriceManager()
  const market = useMarket()

  const emblemFee = ref(0)

  const filteredGuilds = computed(() => {
    return guilds.value?.filter((g) => {
      return g.emblem == 0
    })
  })

  const getGuilds = async () => {
    if (account.isConnected) {
      try {
        main.loading = true
        const tokens = await guild.getGuilds()
        guilds.value = await Promise.all(
          tokens.map(async (token) => {
            const id = Number(token.toString())
            const c = (await guild.getGuild(id))[0]
            return { ...c, id: id }
          })
        )

        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        main.loading = false
      }
    }
  }
  getGuilds()

  const getEmblemFee = async () => {
    const fee = await priceManager.getEmblemFee()
    emblemFee.value = Number(utils.formatUnits(fee, 'ether'))
  }

  getEmblemFee()

  defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  })

  const closeModal = () => {
    emit('update:modelValue', false)
  }

  const emit = defineEmits(['update:modelValue'])

  onMounted(async () => {
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))
    showCarousel.value = true
    await nextTick()
    await new Promise((r) => setTimeout(r, 100))
    carousel.value.restartCarousel()
  })

  const buyEmblem = async () => {
    if (selectedGuild.value) {
      try {
        main.loading = true
        const tx = await market.buyEmblem(
          selectedGuild.value.id,
          currentSlide.value + 1
        )
        await tx.wait()
        closeModal()
      } catch (error) {
        //
      } finally {
        main.loading = false
      }
    }
  }

  const hasAllowance = ref(false)

  const getAllowance = async () => {
    if (account.isConnected) {
      const allowance = await account.getDKAllowance(
        useContract().market.address
      )
      if (allowance.isZero()) {
        hasAllowance.value = false
        return
      }
      hasAllowance.value = true
    }
  }

  getAllowance()

  const approveDK = async () => {
    try {
      main.loading = true
      const res = await account.approveDK(useContract().market.address)
      const receipt = await res.wait()
      console.log(receipt)
      getAllowance()
      // eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.code !== 4001) {
        //
      }
    } finally {
      main.loading = false
    }
  }
</script>

<style>
  .carousel__slide > .carousel__item {
    transform: scale(1);
    opacity: 0.5;
    transition: 0.5s;
  }
  .carousel__slide--visible > .carousel__item {
    opacity: 1;
    transform: rotateY(0);
  }
  .carousel__slide--next > .carousel__item {
    transform: scale(0.9) translate(-10px);
  }
  .carousel__slide--prev > .carousel__item {
    transform: scale(0.9) translate(10px);
  }
  .carousel__slide--active > .carousel__item {
    transform: scale(1.1);
  }

  .carousel__slide {
    padding: 10px;
  }

  .carousel__prev,
  .carousel__next {
    @apply bg-teal-700 !important;
  }
</style>
