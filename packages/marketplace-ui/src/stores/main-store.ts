import { defineStore } from 'pinia'
import { ethers } from 'ethers'
const onWidthChange = () => (useMain().width = window.innerWidth)
window.addEventListener('resize', onWidthChange)
export const useMain = defineStore('main', {
  state: () => {
    return {
      loading: false,
      mode: 'buy',
      nft: 'commanders',
      key: 0,
      filter: false,
      width: window.innerWidth,
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
