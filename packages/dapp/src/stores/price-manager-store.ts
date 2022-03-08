import { defineStore } from 'pinia'
import { useContract } from './contract-store'

export const usePriceManager = defineStore('price-manager', {
  actions: {
    isPresale() {
      const contracts = useContract()
      return contracts.priceManager.isPresale()
    },
    async getMintFee() {
      const contracts = useContract()
      return contracts.priceManager.getMintFee()
    },
    async getStableFee() {
      const contracts = useContract()
      return contracts.priceManager.stableFee()
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
