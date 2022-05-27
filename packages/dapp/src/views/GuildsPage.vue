<template>
  <div class="flex flex-col h-full pb-10">
    <NFTList
      :items="paginatedGuilds"
      nft="guilds"
      class="mb-10"
      mode="inventory"
    >
      <div class="flex justify-center mt-5">
        <PrimaryButton
          v-if="hasAllowance"
          class="self-center mt-2"
          @click="guildDialog()"
          >MANAGE</PrimaryButton
        >
      </div>
    </NFTList>
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
    <PrimaryButton class="self-center mt-2" @click="approveGuildMember('C')"
      >APPROVE COMMANDER</PrimaryButton
    >
    <PrimaryButton class="self-center mt-2" @click="approveGuildMember('K')"
      >APPROVE KNIGHT</PrimaryButton
    >

    <PrimaryButton class="self-center mt-2" @click="approveDisband('C')"
      >APPROVE DISBANDC</PrimaryButton
    >
    <PrimaryButton class="self-center mt-2" @click="approveDisband('K')"
      >APPROVE DISBANDK</PrimaryButton
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
                    <SecondaryButton c @click="closeModal()">
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
<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useGuild } from '../stores/guild-store'
  import { usePriceManager } from '../stores/price-manager-store'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import { useAccount } from '../stores/account-store'
  import { Guild } from '../types/guild'
  import { ethers } from 'ethers'
  import GridPagination from '../components/GridPagination.vue'
  import NFTList from '../components/NFTList.vue'
  import DKIcon from '../components/DKIcon.vue'
  import { useContract } from '../stores/contract-store'
  import { useMain } from '../stores/main-store'

  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const guild = useGuild()
  const priceManager = usePriceManager()
  const name = ref('')
  const dialog = ref(false)
  const guilds = ref<Guild[]>([])
  const account = useAccount()
  const mintFee = ref(0)
  const hasAllowance = ref(false)
  const main = useMain()

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

  const guildDialog = async () => {
    await getMintFee()
    name.value = ''
    dialog.value = true
  }

  const closeModal = () => {
    dialog.value = false
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

  const getMintFee = async () => {
    mintFee.value = Number(
      ethers.utils.formatUnits(await priceManager.getGuildMintFee(), 'ether')
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

  const approveDisband = async (member: string) => {
    try {
      main.loading = true
      let res
      if (member == 'C') {
        res = await useContract().commander.functions.setApprovalForAll(
          useContract().guildMember.address,
          true
        )
      } else {
        res = await useContract().knight.functions.setApprovalForAll(
          useContract().guildMember.address,
          true
        )
      }

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

  const approveGuildMember = async (member: string) => {
    try {
      main.loading = true
      let res
      if (member == 'C') {
        res = await useContract().commander.functions.setApprovalForAll(
          useContract().game.address,
          true
        )
      } else {
        res = await useContract().knight.functions.setApprovalForAll(
          useContract().game.address,
          true
        )
      }

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
