<template>
  <div class="w-full flex justify-center px-2 gap-2">
    <div
      class="flex w-full justify-center items-center flex-col border border-white rounded-lg py-2"
    >
      <span class="text-base font-bold text-red-700"> {{ hours }}</span>
      <span class="text-xs">Hours</span>
    </div>
    <div
      class="flex w-full justify-center items-center flex-col border border-white rounded-lg py-2"
    >
      <span class="text-base font-bold text-green-700"> {{ minutes }}</span>
      <span class="text-xs">Minutes</span>
    </div>
    <div
      class="flex w-full justify-center items-center flex-col border border-white rounded-lg py-2"
    >
      <span class="text-base font-bold text-white"> {{ seconds }}</span>
      <span class="text-xs">Seconds</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs'
  import { ref } from 'vue'

  const hours = ref('00')
  const minutes = ref('00')
  const seconds = ref('00')

  const props = defineProps({
    timestamp: {
      type: Number,
      required: true,
    },
  })
  if (props.timestamp) {
    const countDownDate = dayjs.unix(props.timestamp).add(1, 'd')

    setInterval(function () {
      const now = new Date().getTime()
      const timeleft = countDownDate.valueOf() - now

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
    }, 1000)
  }
</script>

<style scoped></style>
