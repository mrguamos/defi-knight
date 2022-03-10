<template>
  <div class="flex flex-col h-full pb-10">
    <div class="flex justify-center grow">
      <div class="w-full">
        <div class="flex justify-center pb-10">
          <img src="/src/assets/logo-header.png" />
        </div>
        <div class="flex justify-center w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              class="flex justify-between items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min min-w-[20rem]"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-slate-400">200,341</h4>
                <div class="text-slate-400">Total Holders</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min min-w-[20rem]"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'dollar-sign']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-slate-400">174.03</h4>
                <div class="text-slate-500">Current Price</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min min-w-[20rem]"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-slate-400">138,019</h4>
                <div class="text-slate-500">Total Commanders</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min min-w-[20rem]"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-slate-400">203,504</h4>
                <div class="text-slate-500">Total Knights</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min min-w-[20rem]"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-slate-400">7301</h4>
                <div class="text-slate-500">Total Guilds</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min min-w-[20rem]"
            >
              <div class="">
                <FontAwesomeIcon :icon="['fas', 'gem']" size="2x" />
              </div>
              <div class="text-right">
                <h4 class="text-2xl font-semibold text-slate-400">3,103,187</h4>
                <div class="text-slate-500">Rewards Pool</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
