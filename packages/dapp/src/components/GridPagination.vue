<template>
  <div
    class="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
  >
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        class="relative flex disabled:text-opacity-50 items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50"
        :disabled="modelValue === 1"
        @click="prev()"
      >
        Previous
      </button>
      <button
        class="disabled:text-opacity-50 relative flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50"
        :disabled="modelValue === pagesNumber"
        @click="next()"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-400">
          Showing
          <span class="font-medium">
            {{
              modelValue > 1
                ? rowsPerPage * modelValue - rowsPerPage + 1
                : modelValue
            }}</span
          >
          to
          <span class="font-medium">{{
            rowsPerPage * modelValue > length
              ? length
              : rowsPerPage * modelValue
          }}</span>
          of
          <span class="font-medium">{{ length }}</span>
          Results
        </p>
      </div>
      <div>
        <nav
          class="relative z-0 flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            class="relative flex disabled:text-opacity-50 items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :disabled="modelValue === 1"
            @click="prev()"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
          <button
            v-for="p in pagesNumber > totalVisible ? totalVisible : pagesNumber"
            :key="p"
            aria-current="page"
            class="z-10 bg-white border-gray-300 relative flex items-center text-indigo-600 px-4 py-1 border text-sm font-medium"
            :class="p + (startPage() - 1) === modelValue ? 'bg-indigo-100' : ''"
            @click="emit('update:modelValue', p + (startPage() - 1))"
          >
            {{ p + (startPage() - 1) }}
          </button>

          <button
            class="disabled:text-opacity-50 relative flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :disabled="modelValue === pagesNumber"
            @click="next()"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

  const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    length: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    pagesNumber: {
      type: Number,
      required: true,
    },
    totalVisible: {
      type: Number,
      required: true,
    },
    rowsPerPage: {
      type: Number,
      required: true,
    },
  })

  const prev = () => {
    emit('update:modelValue', props.modelValue - 1)
  }

  const next = () => {
    emit('update:modelValue', props.modelValue + 1)
  }

  const startPage = () => {
    {
      if (props.modelValue === 1) {
        return 1
      }

      if (props.modelValue === props.pagesNumber) {
        const start = props.pagesNumber - (props.totalVisible - 1)
        if (start === 0) {
          return 1
        }
        return start
      }

      return props.modelValue - 1
    }
  }
</script>
