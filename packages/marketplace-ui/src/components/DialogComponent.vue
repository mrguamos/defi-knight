<script lang="ts" setup>
  import { useMain } from '../stores/main-store'

  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'
  const main = useMain()
  const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  })

  const closeModal = () => {
    emit('update:modelValue', false)
  }
</script>

<template>
  <TransitionRoot appear :show="props.modelValue" as="template">
    <Dialog as="div" @close="main.loading ? '' : closeModal()">
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
            <DialogOverlay class="fixed inset-0 bg-black opacity-70" />
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
              class="inline-block w-full max-w-lg p-6 my-8 overflow-auto text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
              style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
            >
              <DialogTitle as="h3" class="text-center text-base font-bold">
                <slot name="title"></slot>
              </DialogTitle>
              <div
                class="flex flex-col justify-center items-center mt-5 gap-2 w-full"
              >
                <slot name="content"></slot>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
