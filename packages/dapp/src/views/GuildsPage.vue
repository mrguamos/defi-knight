<template>
  <div class="flex flex-col grow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="text-center">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider"
          >
            Emblem
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider"
          >
            Status
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider"
          >
            Role
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
    </table>
    <div class="grow"></div>
    <PrimaryButton class="self-center mt-2" @click="createGuild()"
      >CREATE GUILD</PrimaryButton
    >
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import { useGuild } from '../stores/guild-store'

  const guild = useGuild()
  const name = ref('')

  const createGuild = () => {
    guild.mintGuild(name.value)
  }
</script>
