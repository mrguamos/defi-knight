import { defineStore } from 'pinia'
import { useContract } from './contract-store'
import { providers, utils } from 'ethers'
export const useGame = defineStore('game', {
  state: () => {
    return {
      isApproved: false,
      iGame: undefined as unknown as utils.Interface,
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
    async conquer(
      guildId: number,
      level: number
    ): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      return contracts.game.conquer(guildId, level, {
        gasLimit: 400000,
      })
    },
    async buyMorale(guildId: number): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      return contracts.game.buyMorale(guildId)
    },
    async getCombat(combatId: number) {
      const contracts = useContract()
      return contracts.game.combatHistory(combatId)
    },
    async claim(): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      return contracts.game.claim()
    },
  },
})
