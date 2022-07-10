<template>
  <div class="flex flex-col h-full pb-10 pt-28 w-full">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 w-full mb-10"
    >
      <div
        v-for="item in paginatedGuilds"
        :key="item.id"
        class="flex flex-col justify-center items-center gap-4 px-5 md:px-0"
      >
        <div
          class="relative flex flex-col w-full justify-center items-center gap-2"
        >
          <router-link :to="`/guilds/manage/${item.id}`">
            <button
              class="absolute top-0 right-0 text-slate-300 inline-flex items-center"
              title="Manage"
            >
              <FontAwesomeIcon
                :icon="['fas', 'cog']"
                size="2x"
                class="animate-spin-slow"
              />
            </button>
          </router-link>
          <img :src="getImageUrl(item.emblem)" class="w-36" />
        </div>
        <div class="text-sm font-bold text-center">
          {{
            utils.parseBytes32String(item.name)
              ? utils.parseBytes32String(item.name)
              : 'G #' +
                item.id.toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })
          }}
        </div>
        <div
          class="flex flex-col w-full p-6 rounded-lg gap-2 min-h-[170px]"
          style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
        >
          <div class="grid grid-cols-2 text-sm font-medium h-min w-full mt-2">
            <div class="flex justify-start items-center w-full">
              <span>ID</span>
            </div>
            <div class="flex justify-end items-center">
              <span>{{ item.id }}</span>
            </div>
            <div class="flex justify-start items-center w-full">
              <span>CP</span>
            </div>
            <div class="flex justify-end items-center">
              <span>{{ item.combatPower }} </span>
            </div>
          </div>
          <div class="mt-2 flex w-full justify-center items-center h-full">
            <button
              v-if="isCooldown(item)"
              class="text-red-700 inline-flex items-center"
              title="Conquer"
              @click.stop="showConquer(item)"
            >
              <FontAwesomeIcon
                :icon="['fas', 'khanda']"
                size="2x"
                class="animate-ping absolute"
              />
              <FontAwesomeIcon :icon="['fas', 'khanda']" size="2x" class="" />
            </button>
            <CountDown v-else :timestamp="Number(item.lastFight.toString())" />
          </div>
        </div>
      </div>
    </div>
    <div class="grow"></div>
    <GridPagination
      v-model="page"
      :length="guilds.length"
      :total-visible="totalVisible"
      :pages-number="pagesNumber"
      :rows-per-page="rowsPerPage"
    />
    <PrimaryButton
      v-if="hasAllowance"
      class="self-center mt-2"
      @click="guildDialog()"
      >CREATE GUILD</PrimaryButton
    >
    <PrimaryButton
      v-if="!hasAllowance"
      class="self-center mt-2"
      @click="approveDK()"
      >APPROVE</PrimaryButton
    >
    <TransitionRoot appear :show="dialog" as="template">
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
                class="inline-block w-auto max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <DialogTitle
                  as="h3"
                  class="text-center text-lg font-medium text-teal-700"
                >
                  <div class="flex justify-center items-center">
                    {{ mintFee }} DK
                    <DKIcon class="w-10 h-10 ml-1" />
                  </div>
                </DialogTitle>
                <div class="flex grow flex-col text-sm gap-4 mt-5">
                  <input
                    v-model="name"
                    class="text-black appearance-none border rounded-lg focus:outline-none focus:border-gray-500"
                    type="text"
                    placeholder="Guild Name"
                  />
                  <div class="flex justify-center gap-4 text-sm text-white">
                    <PrimaryButton @click="mintGuild()"> SUBMIT</PrimaryButton>
                    <SecondaryButton @click="closeModal()">
                      CANCEL</SecondaryButton
                    >
                  </div>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <TransitionRoot appear :show="moraleDialog" as="template">
      <Dialog as="div" @close="main.loading ? '' : closeMoraleModal()">
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
                class="inline-block w-auto max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <DialogTitle
                  as="h3"
                  class="text-center text-lg font-medium text-teal-700"
                  ><div class="flex flex-col gap-2">
                    <span class="text-red-700 animate-pulse"
                      >OUT OF MORALE</span
                    >
                    <div class="flex justify-center items-center">
                      {{ moraleFee }} DK
                      <DKIcon class="w-10 h-10 ml-1" />
                    </div>
                  </div>
                </DialogTitle>
                <div class="flex grow flex-col text-sm gap-4 mt-5">
                  <div class="flex justify-center gap-4 text-sm text-white">
                    <PrimaryButton @click="buyMorale()"> SUBMIT</PrimaryButton>
                    <SecondaryButton c @click="closeMoraleModal()">
                      CANCEL</SecondaryButton
                    >
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
  import { ref, computed } from 'vue'
  import CountDown from '../components/CountDown.vue'
  import { useAccount } from '../stores/account-store'
  import { useGuild } from '../stores/guild-store'
  import { useMain } from '../stores/main-store'
  import { Guild } from '../types/guild'
  import GridPagination from '../components/GridPagination.vue'

  import { useRouter } from 'vue-router'
  import { usePriceManager } from '../stores/price-manager-store'
  import { useGame } from '../stores/game-store'
  import { useContract } from '../stores/contract-store'
  import { utils } from 'ethers'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import DKIcon from '../components/DKIcon.vue'

  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import dayjs from 'dayjs'

  const router = useRouter()
  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 20
  const guild = useGuild()
  const priceManager = usePriceManager()
  const name = ref('')
  const dialog = ref(false)
  const guilds = ref<Guild[]>([])
  const account = useAccount()
  const mintFee = ref(0)
  const hasAllowance = ref(false)
  const main = useMain()
  const game = useGame()
  const moraleDialog = ref(false)

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      getGuilds()
      getAllowance()
    } else {
      guilds.value = []
    }
  })

  main.$subscribe(async (_, state) => {
    if (state.refresh) {
      getGuilds()
      state.refresh = false
    }
  })

  const getMintFee = async () => {
    mintFee.value = Number(
      utils.formatUnits(await priceManager.getGuildMintFee(), 'ether')
    )
  }

  const getAllowance = async () => {
    if (account.isConnected) {
      const allowance = await account.getDKAllowance(useContract().game.address)
      if (allowance.isZero()) {
        hasAllowance.value = false
        return
      }
      hasAllowance.value = true
    }
  }

  const isCooldown = (item: Guild) => {
    if (item.lastFight <= 0) {
      return true
    }
    return dayjs.unix(item.lastFight).add(1, 'day').isSameOrBefore(dayjs())
  }

  getAllowance()

  const approveDK = async () => {
    try {
      main.loading = true
      const res = await account.approveDK(useContract().game.address)
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

  const moraleFee = ref(0)

  const guildDialog = async () => {
    await getMintFee()
    name.value = ''
    dialog.value = true
  }

  const closeModal = () => {
    dialog.value = false
  }

  const closeMoraleModal = () => {
    moraleDialog.value = false
  }

  const mintGuild = async () => {
    try {
      main.loading = true
      const res = await guild.mintGuild(name.value)
      const receipt = await res.wait()
      console.log(receipt)
      guilds.value.push(await getGuild())
      // eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.code !== 4001) {
        //
      }
    } finally {
      main.loading = false
      closeModal()
    }
  }

  const getGuild = async () => {
    const tokenId: number = parseInt(await guild.getLastIndexGuild(), 10)
    const c = (await guild.getGuild(tokenId))[0]
    return { ...c, id: tokenId }
  }

  const pagesNumber = computed(() =>
    Math.ceil(guilds.value.length / rowsPerPage)
  )

  const paginatedGuilds = computed(() => {
    const start = (page.value - 1) * rowsPerPage
    return guilds.value.slice(start, start + rowsPerPage)
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

  const showManage = (id: number) => {
    router.push(`/guilds/manage/${id}`)
  }

  const showConquer = async (item: Guild) => {
    if (item.morale > 0) {
      router.push(`/conquer/${item.id}`)
    } else {
      const knights = (await guild.getAllKnights(item.id))[0]
      console.log(knights)
      moraleFee.value =
        Number(utils.formatUnits(await priceManager.getMoraleFee(), 'ether')) *
        (14 * knights.length)
      id.value = item.id
      moraleDialog.value = true
    }
  }

  const id = ref(0)

  const buyMorale = async () => {
    try {
      main.loading = true
      const tx = await game.buyMorale(id.value)
      await tx.wait()
      closeMoraleModal()
      router.push(`/conquer/${id.value}`)
    } catch (error) {
      //
    } finally {
      main.loading = false
    }
  }

  function getImageUrl(id: number) {
    return new URL(`/src/assets/emblems/${id}.png`, import.meta.url).href
  }
</script>

<style scoped></style>
