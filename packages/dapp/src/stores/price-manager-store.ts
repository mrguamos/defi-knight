import { defineStore } from 'pinia'
import { useContract } from './contract-store'

export const usePriceManager = defineStore('price-manager', {
  actions: {
    async getMintFee() {
      const contracts = useContract()
      return contracts.priceManager.getMintFee()
    },
    async getStableFee() {
      const contracts = useContract()
      return contracts.priceManager.getStableFee()
    },
    async getGuildMintFee() {
      const contracts = useContract()
      return contracts.priceManager.getGuildFee()
    },
    async getMoraleFee() {
      const contracts = useContract()
      return contracts.priceManager.getMoraleFee()
    },
  },
})
