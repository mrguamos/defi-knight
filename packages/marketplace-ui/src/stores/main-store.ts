import { defineStore } from 'pinia'
import { ethers } from 'ethers'

export type MainStore = {
  refresh: boolean
}

export const useMain = defineStore('main', {
  state: () => {
    return {
      loading: false,
      mode: 'buy',
      nft: 'commanders',
    }
  },
  getters: {
    getEthAmount: () => {
      return function (amount: string) {
        return ethers.utils.formatUnits(amount, 'ether')
      }
    },
  },
})
