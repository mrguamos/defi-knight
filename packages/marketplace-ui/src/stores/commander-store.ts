import { defineStore } from 'pinia'
import { useAccount } from './account-store'

import { useContract } from './contract-store'
import type { BigNumberish } from 'ethers'

export const useCommander = defineStore('commander', {
  state: () => {
    return {}
  },
  actions: {
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
    getCommander(tokenId: BigNumberish) {
      const contracts = useContract()
      return contracts.commander.functions.getCommander(tokenId.toString())
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
    isApprovedForAll(address: string) {
      const contracts = useContract()
      const account = useAccount()
      return contracts.commander.isApprovedForAll(account.address, address)
    },
    setApprovalForAll(address: string) {
      const contracts = useContract()
      return contracts.commander.functions.setApprovalForAll(address, true)
    },
    safeTransferFrom(to: string, tokenId: number) {
      const contracts = useContract()
      return contracts.commander.transferFrom(useAccount().address, to, tokenId)
    },
  },
})
