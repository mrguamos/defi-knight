<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'
  import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

  const rarities = [
    { id: 0, name: 1 },
    { id: 1, name: 2 },
    { id: 2, name: 3 },
    { id: 3, name: 4 },
    { id: 4, name: 5 },
  ]
  const min = ref(rarities[0])
  const max = ref(rarities[4])
</script>
<template>
  <div class="flex flex-col w-full justify-center items-center p-2 space-y-2">
    <span class="text-lg font-semibold">Race</span>
    <div class="flex justify-center items-center gap-2">
      <input type="checkbox" id="orc" class="rounded-md" />
      <label for="orc">Orc</label>
      <input type="checkbox" id="demon" class="rounded-md" />
      <label for="demon">Demon</label>
      <input type="checkbox" id="human" class="rounded-md" />
      <label for="human">Human</label>
    </div>
  </div>
  <div
    class="flex flex-col w-full justify-center items-center p-2 pb-4 space-y-2"
  >
    <span class="text-lg font-semibold">Rarity</span>
    <div class="w-full flex gap-2">
      <div class="flex flex-col w-1/2 justify-center items-center">
        <label for="minR">Min</label>
        <Listbox v-model="min" class="w-full" id="minR">
          <div class="relative mt-1">
            <ListboxButton
              class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate text-black">{{ min.name }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <SelectorIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="r in rarities"
                  :key="r.id"
                  :value="r"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ r.name }}</span
                    >
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <div class="flex flex-col w-1/2 justify-center items-center">
        <label for="maxR">Max</label>
        <Listbox v-model="max" class="w-full" id="maxR">
          <div class="relative mt-1">
            <ListboxButton
              class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate text-black">{{ max.name }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <SelectorIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="r in rarities"
                  :key="r.name"
                  :value="r"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ r.name }}</span
                    >
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
    </div>
  </div>
  <slot></slot>
  <div class="flex flex-col w-full justify-center items-center p-2 space-y-2">
    <span class="text-lg font-semibold">Others</span>
    <div class="flex justify-center items-center gap-2">
      <input type="checkbox" id="genesis" class="rounded-md" />
      <label for="genesis">Genesis</label>
      <input type="checkbox" id="non-genesis" class="rounded-md" />
      <label for="non-genesis">Non Genesis</label>
    </div>
  </div>
</template>
