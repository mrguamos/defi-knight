<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-center grow">
      <div>
        <div class="flex justify-center pb-10">
          <img src="/src/assets/logo-header.png" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            class="flex items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min"
          >
            <div class="p-3">
              <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
            </div>
            <div class="mx-4">
              <h4 class="text-2xl font-semibold">200,341</h4>
              <div class="">Holders</div>
            </div>
          </div>
          <div
            class="flex items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min"
          >
            <div class="py-3 pl-3 pr-8">
              <FontAwesomeIcon :icon="['fas', 'dollar-sign']" size="2x" />
            </div>
            <div class="mx-4">
              <h4 class="text-2xl font-semibold">174.03</h4>
              <div class="">Current Price</div>
            </div>
          </div>
          <div
            class="flex items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min"
          >
            <div class="p-3">
              <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
            </div>
            <div class="mx-4">
              <h4 class="text-2xl font-semibold">138,019</h4>
              <div class="">Total Commanders</div>
            </div>
          </div>
          <div
            class="flex items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min"
          >
            <div class="p-3">
              <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
            </div>
            <div class="mx-4">
              <h4 class="text-2xl font-semibold">203,504</h4>
              <div class="">Total Knights</div>
            </div>
          </div>
          <div
            class="flex items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min"
          >
            <div class="p-3">
              <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
            </div>
            <div class="mx-4">
              <h4 class="text-2xl font-semibold">7301</h4>
              <div class="">Total Guilds</div>
            </div>
          </div>
          <div
            class="flex items-center px-4 py-6 border-blue-500 bg-transparent border-2 rounded-md shadow-md h-min"
          >
            <div class="p-3">
              <FontAwesomeIcon :icon="['fas', 'users']" size="2x" />
            </div>
            <div class="mx-4">
              <h4 class="text-2xl font-semibold">3,103,187</h4>
              <div class="">Rewards Pool</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
