import { defineStore } from 'pinia'
import { ethers } from 'ethers'

export const useMain = defineStore('main', {
  state: () => {
    return {
      loading: false,
      mode: 'buy',
      nft: 'commanders',
      key: 0,
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
