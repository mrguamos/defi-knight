import { defineStore } from 'pinia'
import { useContract } from './contract-store'
import Moralis from 'moralis'
import dkABI from 'smart-contracts/build/contracts/DefiKnight.json'

export const useAccount = defineStore('account', {
  state: () => {
    return {
      totalDK: 0,
    }
  },
  actions: {
    async init() {
      await this.getDK()
    },
    async getDK() {
      const address = this.getAddress
      const balances = await Moralis.Web3API.account.getTokenBalances({
        chain: 'bsc',
        address: address,
        token_addresses: [
          dkABI.networks['1337' as keyof typeof dkABI.networks].address,
        ],
      })
      console.log(balances)
    },
  },
  getters: {
    croppedAddress: () => {
      if (Moralis.User.current()) {
        const address = Moralis.User.current()?.attributes.ethAddress
        return (
          address.substring(0, 5) +
          '...' +
          address.substring(address.length - 4, address.length)
        )
      }
    },
    getAddress: () => {
      return Moralis.User.current()?.attributes.ethAddress
    },
    getUser: () => {
      const user = Moralis.User.current()
      return user
    },
    isConnected() {
      const user = this.getUser
      if (user) return true
      return false
    },
  },
})
