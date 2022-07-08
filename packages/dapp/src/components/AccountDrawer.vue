<template>
  <div class="z-30 flex h-screen w-full fixed justify-end">
    <div
      class="grow"
      @click="
        () => {
          emit('toggle', false)
          useMain().drawer = false
        }
      "
    ></div>
    <div
      class="drawer relative flex flex-col h-screen w-96 ease-in-out duration-300 shadow-lg overflow-y-auto overscroll-contain"
    >
      <button
        class="absolute top-0 left-1 text-red-700 text-xl font-bold"
        @click="
          () => {
            emit('toggle', false)
            useMain().drawer = false
          }
        "
      >
        X
      </button>
      <div class="self-center pt-10 pb-10">
        <router-link
          to="/"
          @click="
            () => {
              emit('toggle', false)
              useMain().drawer = false
            }
          "
        >
          <img src="/src/assets/logo-header.png" class="w-56" />
        </router-link>
      </div>

      <div class="w-full h-full flex flex-col gap-2 items-center">
        <span class="text-teal-700 font-bold text-base">REWARDS</span>
        <div class="grid grid-cols-2 w-full px-2">
          <div class="border-b border-r border-t text-center border-blue-500">
            Amount
          </div>
          <div class="border-b border-l text-center border-t border-blue-500">
            {{
              numeral(
                account.getAccountRewards('ether', rewards.amount)
              ).format('0a.00')
            }}
            DK
          </div>
          <div class="border-b border-r text-center border-blue-500">Fee</div>
          <div
            class="border-b border-l text-center border-blue-500"
            :class="fee > 0 ? 'text-red-500' : 'text-green-500'"
          >
            {{
              fee.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })
            }}%
          </div>
        </div>
        <span class="text-teal-700 font-bold text-base">REMAINING</span>
        <div class="w-full flex justify-center px-2 mt-2 gap-2">
          <div
            class="flex w-full justify-center items-center flex-col border border-white rounded-lg py-2"
          >
            <span class="text-base font-bold text-purple-500"> {{ days }}</span>
            <span class="text-xs">Days</span>
          </div>
          <div
            class="flex w-full justify-center items-center flex-col border border-white rounded-lg py-2"
          >
            <span class="text-base font-bold text-red-700"> {{ hours }}</span>
            <span class="text-xs">Hours</span>
          </div>
          <div
            class="flex w-full justify-center items-center flex-col border border-white rounded-lg py-2"
          >
            <span class="text-base font-bold text-green-700">
              {{ minutes }}</span
            >
            <span class="text-xs">Minutes</span>
          </div>
          <div
            class="flex w-full justify-center items-center flex-col border border-white rounded-lg py-2"
          >
            <span class="text-base font-bold text-white"> {{ seconds }}</span>
            <span class="text-xs">Seconds</span>
          </div>
        </div>
        <div
          class="w-full hover:cursor-pointer bg-teal-700 flex justify-center items-center py-2 mt-5"
          @click="claim()"
        >
          <span class="">CLAIM</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import numeral from 'numeral'
  import { useAccount } from '../stores/account-store'
  import dayjs from 'dayjs'
  import { ref } from 'vue'
  import { useMain } from '../stores/main-store'
  import { computed } from '@vue/reactivity'
  import { useRewards } from '../stores/rewards-store'
  import { useGame } from '../stores/game-store'

  const emit = defineEmits(['toggle'])

  const rewardsManager = useRewards()

  const account = useAccount()

  const game = useGame()

  const props = defineProps({
    rewards: {
      type: Object,
      required: true,
    },
  })

  const countDownDate = dayjs
    .unix(props.rewards.lastClaim)
    .add(rewardsManager.rewardsDuration, 'd')

  const days = ref('00')
  const hours = ref('00')
  const minutes = ref('00')
  const seconds = ref('00')

  setInterval(function () {
    if (props.rewards.lastClaim > 0) {
      const now = new Date().getTime()
      const timeleft = countDownDate.valueOf() - now

      days.value = Math.floor(timeleft / (1000 * 60 * 60 * 24)).toLocaleString(
        'en-US',
        {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }
      )
      hours.value = Math.floor(
        (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
      minutes.value = Math.floor(
        (timeleft % (1000 * 60 * 60)) / (1000 * 60)
      ).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
      seconds.value = Math.floor(
        (timeleft % (1000 * 60)) / 1000
      ).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    }
  }, 1000)

  const fee = computed(() => {
    let _fee = 0
    if (props.rewards.lastClaim > 0) {
      // const r =
      //   Number(hours.value) && Number(minutes.value) && Number(seconds.value)
      // _fee =
      //   rewardsManager.rewardsFee -
      //   (rewardsManager.rewardsDuration - Number(days.value)) *
      //     rewardsManager.rewardsFeePerDay
      // if (r) _fee += rewardsManager.rewardsFeePerDay
      // console.log(_fee)
      const diff = countDownDate.add(1, 'd').diff(dayjs(), 'd')
      _fee = diff * rewardsManager.rewardsFeePerDay
    }

    return _fee
  })

  const claim = async () => {
    try {
      useMain().loading = true
      const res = await game.claim()
      await res.wait()
      emit('toggle', false)
      useMain().drawer = false
    } catch (error) {
      //
    } finally {
      useMain().loading = false
    }
  }
</script>

<style scoped>
  .drawer {
    @apply bg-slate-900 bg-opacity-90;
  }
</style>
