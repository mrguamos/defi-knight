import { defineStore } from 'pinia'
export const useGame = defineStore('game', {
  state: () => {
    return {
      isApproved: false,
    }
  },
})
