import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
import { ethers, BigNumberish, providers } from 'ethers'

export const useCommander = defineStore('commander', {
  state: () => {
    return {}
  },
  actions: {
    mintCommander(): Promise<providers.TransactionResponse> {
      const contracts = useContract()

      return contracts.game.functions.mintCommanderPresale({
        value: ethers.utils.parseUnits('0.00001', 'ether'),
        gasLimit: 300000,
      })
    },
    isPresale() {
      const contracts = useContract()
      return contracts.commander.functions.isPresale()
    },
    async getCommanders() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.commander.functions.balanceOf(account.address),
        10
      )

      const tokens: Promise<BigNumberish[]> = Promise.all(
        [...Array(balance).keys()].map((_, i) =>
          contracts.commander.functions.tokenOfOwnerByIndex(account.address, i)
        )
      )
      return tokens
    },
    getCommander(tokenId: number) {
      const contracts = useContract()
      return contracts.commander.functions.getCommander(tokenId)
    },
    async getLastIndexCommander() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.commander.functions.balanceOf(account.address),
        10
      )
      return contracts.commander.functions.tokenOfOwnerByIndex(
        account.address,
        balance - 1
      )
    },
  },
})
