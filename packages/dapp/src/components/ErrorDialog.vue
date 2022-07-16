<template>
  <div>
    <TransitionRoot appear :show="main.errorDialog" as="template">
      <Dialog as="div" @close="main.loading ? '' : (main.errorDialog = false)">
        <div class="fixed inset-0 z-50 overflow-y-auto">
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
                class="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 bg-opacity-90 rounded-md"
                style="box-shadow: 0 0 10px 3px rgb(59 130 246)"
              >
                <DialogTitle
                  as="h3"
                  class="text-center text-lg font-medium text-slate-300"
                >
                  <FontAwesomeIcon
                    :icon="['fas', 'exclamation-triangle']"
                    class="text-red-500"
                  />
                </DialogTitle>
                <div class="flex grow flex-col text-sm gap-4 mt-5 text-center">
                  <span class="font-base text-lg text-slate-300 uppercase">{{
                    main.errorMessage
                  }}</span>
                  <div
                    class="flex justify-center gap-4 text-sm text-white mt-2"
                  >
                    <SecondaryButton @click="main.errorDialog = false">
                      CLOSE</SecondaryButton
                    >
                  </div>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
  import SecondaryButton from '../components/SecondaryButton.vue'
  import { useMain } from '../stores/main-store'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'

  const main = useMain()
</script>

<style scoped></style>
