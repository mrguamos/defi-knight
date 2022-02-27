import { defineStore } from 'pinia'
import { useContract } from './contract-store'
import { ethers } from 'ethers'

export const useAccount = defineStore('account', {
  state: () => {
    return {
      address: '',
      totalDK: 0,
      isConnected: false,
    }
  },
  actions: {
    async init(address: string) {
      this.address = address
      this.isConnected = true
      await this.getDK()
    },
    async getDK() {
      const contracts = useContract()
      this.totalDK = await contracts.dk.functions.balanceOf(this.address)
    },
  },
  getters: {
    croppedAddress: (state) => {
      if (state.address) {
        return (
          state.address.substring(0, 5) +
          '...' +
          state.address.substring(
            state.address.length - 4,
            state.address.length
          )
        )
      }
    },
    getTotalDK: (state) => {
      return function (unit: string) {
        return ethers.utils.formatUnits(state.totalDK.toString(), unit)
      }
    },
  },
})
