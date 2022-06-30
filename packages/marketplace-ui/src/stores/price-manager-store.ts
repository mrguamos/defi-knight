import { defineStore } from 'pinia'
import { useContract } from './contract-store'

export const usePriceManager = defineStore('price-manager', {
  actions: {
    async getEmblemFee() {
      const contracts = useContract()
      return contracts.priceManager.getEmblemFee()
    },
  },
})
