import { defineStore } from 'pinia'
import { useContract } from './contract-store'
export const useGame = defineStore('game', {
  actions: {
    async getPresaleFee() {
      const contracts = useContract()
      return contracts.game.isPresale()
    },
  },
})
