import { defineStore } from 'pinia'
import { useWeb3 } from './web3-store'
import { useContract } from './contract-store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'

export const useAccount = defineStore('account', {
  state: () => {
    return {
      address: '',
      totalDK: 0,
      isConnected: false,
    }
  },
  actions: {
    async init() {
      this.isConnected = true
      const eth = useWeb3()
      this.address = (await eth.web3.eth.getAccounts())[0]
      await this.getDK()
    },
    async getDK() {
      const contracts = useContract()
      this.totalDK = await contracts.dk.methods.balanceOf(this.address).call()
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
        return Web3.utils.fromWei(state.totalDK, unit)
      }
    },
  },
})
