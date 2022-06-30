<template>
  <div class="flex flex-col h-full pb-10 items-center">
    <div class="flex justify-center grow items-center">
      <div class="w-full">
        <div class="flex justify-center pb-10 items-center">
          <img src="/src/assets/logo-header.png" />
        </div>
        <div class="flex justify-center w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div
              class="flex justify-between items-center px-4 py-6 bg-transparent rounded-md h-min min-w-[20rem]"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-teal-700">
                  {{ totalCommanders }}
                </h4>
                <div class="text-white">Total Commanders</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 bg-transparent rounded-md h-min min-w-[20rem]"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-teal-700">
                  {{ totalKnights }}
                </h4>
                <div class="text-white">Total Knights</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 bg-transparent rounded-md h-min min-w-[20rem]"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-teal-700">
                  {{ totalGuilds }}
                </h4>
                <div class="text-white">Total Guilds</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 bg-transparent rounded-md h-min min-w-[20rem]"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'gem']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-teal-700">
                  {{ rewardsPool }}
                </h4>
                <div class="text-white">Rewards Pool</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { utils } from 'ethers'
  import { Ref, ref } from 'vue'
  import { useCommander } from '../stores/commander-store'
  import { useGame } from '../stores/game-store'
  import { useGuild } from '../stores/guild-store'
  import { useKnight } from '../stores/knight-store'

  const speed = 200

  const commander = useCommander()
  const knight = useKnight()
  const guild = useGuild()
  const game = useGame()
  const totalCommanders = ref(0)
  const totalKnights = ref(0)
  const totalGuilds = ref(0)
  const rewardsPool = ref(0)

  const animate = (counter: number, val: Ref<number>) => {
    function handler() {
      const value = counter
      const data = val.value
      console.log(val.value)
      const time = value / speed
      if (data < value) {
        val.value = Math.ceil(data + time)
        setTimeout(handler, 1)
      } else {
        val.value = value
      }
    }
    handler()
  }

  const getTotalCommanders = async () => {
    const counter = Number((await commander.getTotalCommanders()).toString())
    animate(counter, totalCommanders)
  }

  getTotalCommanders()

  const getTotalKnights = async () => {
    const counter = Number((await knight.getTotalKnights()).toString())
    animate(counter, totalKnights)
  }

  getTotalKnights()

  const getTotalGuilds = async () => {
    const counter = Number((await guild.getTotalGuilds()).toString())
    animate(counter, totalGuilds)
  }

  getTotalGuilds()

  const getRewardsPool = async () => {
    const counter = Number(
      utils.formatUnits(await game.getRewardsPool(), 'ether')
    )

    animate(counter, rewardsPool)
  }

  getRewardsPool()
</script>
