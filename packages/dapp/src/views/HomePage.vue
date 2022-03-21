<template>
  <div class="flex flex-col h-full pb-10">
    <div class="flex justify-center grow">
      <div class="w-full">
        <div class="flex justify-center pb-10">
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
                <h4 class="text-2xl font-semibold text-teal-700">200,341</h4>
                <div class="text-white">Total Holders</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 bg-transparent rounded-md h-min min-w-[20rem]"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'dollar-sign']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-teal-700">174.03</h4>
                <div class="text-white">Current Price</div>
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
                <h4 class="text-2xl font-semibold text-teal-700">138,019</h4>
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
                <h4 class="text-2xl font-semibold text-teal-700">203,504</h4>
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
                <h4 class="text-2xl font-semibold text-teal-700">7301</h4>
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
                <h4 class="text-2xl font-semibold text-teal-700">3,103,187</h4>
                <div class="text-white">Rewards Pool</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
