import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
import { ethers, BigNumberish, providers } from 'ethers'

export const useGuild = defineStore('guild', {
  state: () => {
    return {}
  },
  actions: {
    mintGuild(name: string): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      return contracts.game.functions.mintGuild(
        ethers.utils.formatBytes32String(name)
      )
    },
    isPresale() {
      const contracts = useContract()
      return contracts.guild.functions.isPresale()
    },
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
    async getMintFee() {
      const contracts = useContract()
      return contracts.game.getGuildFee()
    },
  },
})
