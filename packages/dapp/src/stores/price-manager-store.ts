import { defineStore } from 'pinia'
import { useContract } from './contract-store'

export const usePriceManager = defineStore('price-manager', {
  actions: {
    isPresale() {
      const contracts = useContract()
      return contracts.priceManager.functions.isPresale()
    },
    async getMintFee() {
      const contracts = useContract()
      return contracts.priceManager.getMintFee()
    },
    async getPresaleFee() {
      const contracts = useContract()
      return contracts.priceManager.presaleFee()
    },
    async getGuildMintFee() {
      const contracts = useContract()
      return contracts.priceManager.getGuildFee()
    },
  },
})
