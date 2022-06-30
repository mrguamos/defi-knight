import { defineStore } from 'pinia'
import { useContract } from './contract-store'
import { providers } from 'ethers'
export const useGame = defineStore('game', {
  state: () => {
    return {
      isApproved: false,
    }
  },
  actions: {
    async addGuildMembers(
      guildId: number,
      commanders: number[],
      knights: number[]
    ): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      return contracts.game.addGuildMembers(guildId, commanders, knights)
    },
    async disbandGuild(
      guildId: number
    ): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      return contracts.game.disbandGuild(guildId)
    },

    async getRewardsPool() {
      const contracts = useContract()
      return contracts.dk.balanceOf(contracts.game.address)
    },
  },
})
