import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
import BN from 'bn.js'

export const useCommander = defineStore('commander', {
  state: () => {
    return {}
  },
  actions: {
    mintCommander() {
      const contracts = useContract()
      const account = useAccount()
      return contracts.game.methods.mintCommanderPresale().send({
        value: Web3.utils.toWei('0.00001', 'ether').toString(),
        from: account.address,
      })
    },
    isPresale() {
      const contracts = useContract()
      return contracts.commander.methods.isPresale().call()
    },
    async getCommanders() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.commander.methods.balanceOf(account.address).call(),
        10
      )
      const tokens: Promise<BN[]> = Promise.all(
        [...Array(balance).keys()].map((_, i) =>
          contracts.commander.methods
            .tokenOfOwnerByIndex(account.address, i)
            .call()
        )
      )
      return tokens
    },
    getCommander(tokenId: number) {
      const contracts = useContract()
      return contracts.commander.methods.getCommander(tokenId).call()
    },
    async getLastIndexCommander() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.commander.methods.balanceOf(account.address).call(),
        10
      )
      return contracts.commander.methods
        .tokenOfOwnerByIndex(account.address, balance - 1)
        .call()
    },
  },
})
