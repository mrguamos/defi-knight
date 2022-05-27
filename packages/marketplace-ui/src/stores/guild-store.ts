import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'

import type { BigNumberish } from 'ethers'

export const useGuild = defineStore('guild', {
  state: () => {
    return {}
  },
  actions: {
    async getGuilds() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.guild.functions.balanceOf(account.address),
        10
      )
      const tokens: Promise<BigNumberish[]> = Promise.all(
        [...Array(balance).keys()].map((_, i) =>
          contracts.guild.functions.tokenOfOwnerByIndex(account.address, i)
        )
      )
      return tokens
    },
    getGuild(tokenId: number) {
      const contracts = useContract()
      return contracts.guild.functions.getGuild(tokenId)
    },
    async getLastIndexGuild() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.guild.functions.balanceOf(account.address),
        10
      )
      return contracts.guild.functions.tokenOfOwnerByIndex(
        account.address,
        balance - 1
      )
    },
    isApprovedForAll(address: string) {
      const contracts = useContract()
      const account = useAccount()
      return contracts.guild.isApprovedForAll(account.address, address)
    },
    setApprovalForAll(address: string) {
      const contracts = useContract()
      return contracts.guild.functions.setApprovalForAll(address, true)
    },
    safeTransferFrom(to: string, tokenId: number) {
      const contracts = useContract()
      return contracts.knight.safeTransferFrom(
        useAccount().address,
        to,
        tokenId
      )
    },
  },
})
