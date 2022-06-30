import { defineStore } from 'pinia'
import { useContract } from './contract-store'
import { ethers, providers } from 'ethers'

export const useMarket = defineStore('market', {
  state: () => {
    return {
      isApproved: false,
      hasAllowance: false,
    }
  },
  actions: {
    async sell(nftType: number, tokenId: number, amount: string) {
      const contracts = useContract()

      return contracts.market.functions.sell(
        nftType,
        tokenId,
        ethers.utils.parseUnits(amount, 'ether')
      )
    },
    async edit(nftType: number, tokenId: number, amount: string) {
      const contracts = useContract()
      return contracts.market.functions.edit(
        nftType,
        tokenId,
        ethers.utils.parseUnits(amount, 'ether')
      )
    },
    async buy(nftType: number, tokenId: number, amount: string) {
      const contracts = useContract()
      return contracts.market.functions.buy(nftType, tokenId, amount, {
        value: amount,
      })
    },
    async cancel(nftType: number, tokenId: number) {
      const contracts = useContract()
      return contracts.market.functions.cancel(nftType, tokenId)
    },
    getListing(nftType: number, tokenId: number) {
      const contracts = useContract()
      return contracts.market.functions.getListing(nftType, tokenId)
    },
    getListings(nftType: number, tokenIds: number[]) {
      const contracts = useContract()
      return contracts.market.functions.getListings(nftType, tokenIds)
    },
    async buyEmblem(
      guildId: number,
      emblem: number
    ): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      return contracts.market.functions.buyEmblem(guildId, emblem)
    },
  },
})
