<template>
  <div class="flex flex-col h-full pb-10">
    <DefiSpinner v-if="loading" />
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block py-2 min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow-md sm:rounded-lg">
          <table class="min-w-full">
            <thead class="bg-gray-700 text-gray-400">
              <tr>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  EMBLEM
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  NAME
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  MORALE
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  COMBAT POWER
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-xs font-medium tracking-wider text-left uppercase"
                >
                  BONUS
                </th>
                <th scope="col" class="relative py-3 px-6">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="">
              <tr
                v-for="item of paginatedGuilds"
                :key="item.id"
                class="border-b bg-gray-800 border-gray-700"
              >
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ item.id }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ Web3.utils.toAscii(item.emblem) }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ Web3.utils.toAscii(item.name) }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ item.morale }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ item.combatPower }}
                </td>
                <td class="py-4 px-6 text-sm font-medium whitespace-nowrap">
                  {{ item.winRate }}
                </td>
                <td
                  class="text-right px-6 text-sm font-medium whitespace-nowrap"
                >
                  <button class="text-[#9ba1fd] inline-flex items-center">
                    <FontAwesomeIcon :icon="['fas', 'edit']" size="lg" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
    <PrimaryButton class="self-center mt-2" @click="guildDialog()"
      >CREATE GUILD</PrimaryButton
    >

    <TransitionRoot appear :show="dialog" as="template">
      <Dialog as="div" @close="closeModal">
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
              <DialogOverlay class="fixed inset-0" />
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
                class="inline-flex justify-center min-w-[500px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-r to-[#040a34] from-gray-900 shadow-xl rounded-lg"
              >
                <div class="flex grow flex-col text-sm gap-4">
                  <input
                    v-model="name"
                    class="text-black appearance-none border rounded-lg focus:outline-none focus:border-gray-500"
                    type="text"
                    placeholder="Guild Name"
                  />
                  <div class="flex justify-between text-sm text-white">
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
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useGuild } from '../stores/guild-store'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
  } from '@headlessui/vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import SecondaryButton from '../components/SecondaryButton.vue'
  import DefiSpinner from '../components/DefiSpinner.vue'
  import { useAccount } from '../stores/account-store'
  import BN from 'bn.js'
  import { Guild } from '../types/guild'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import Web3 from 'web3/dist/web3.min.js'
  import GridPagination from '../components/GridPagination.vue'

  const page = ref(1)
  const totalVisible = 3
  const rowsPerPage = 10
  const guild = useGuild()
  const name = ref('')
  const dialog = ref(false)
  const loading = ref(false)
  const guilds = ref<Guild[]>([])
  const account = useAccount()

  account.$subscribe(async (_, state) => {
    if (state.isConnected) {
      await getGuilds()
    } else {
      guilds.value = []
    }
  })

  const guildDialog = () => {
    name.value = ''
    dialog.value = true
  }

  const closeModal = () => {
    dialog.value = false
  }

  const mintGuild = async () => {
    try {
      loading.value = true
      await guild.mintGuild(name.value)
      guilds.value.push(await getGuild())
      // eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.code !== 4001) {
        //
      }
    } finally {
      loading.value = false
      closeModal()
    }
  }

  const getGuilds = async () => {
    if (account.isConnected) {
      try {
        loading.value = true
        const tokens: BN[] = await guild.getGuilds()
        guilds.value = await Promise.all(
          tokens.map(async (token) => {
            const id = Number(token.toString())
            const c = await guild.getGuild(id)
            return { ...c, id: id }
          })
        )

        // eslint-disable-next-line
      } catch (e: any) {
      } finally {
        loading.value = false
      }
    }
  }
  getGuilds()

  const getGuild = async () => {
    const tokenId: number = parseInt(await guild.getLastIndexGuild(), 10)
    const c = await guild.getGuild(tokenId)
    return { ...c, id: tokenId }
  }

  const pagesNumber = computed(() =>
    Math.ceil(guilds.value.length / rowsPerPage)
  )

  const paginatedGuilds = computed(() => {
    const start = (page.value - 1) * rowsPerPage
    return guilds.value.slice(start, start + rowsPerPage)
  })
</script>
