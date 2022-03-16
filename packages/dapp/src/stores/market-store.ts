import { defineStore } from 'pinia'
import { useContract } from './contract-store'
import { ethers } from 'ethers'
import axios from 'axios'
export const useMarket = defineStore('market', {
  actions: {
    async sell(nftType: number, tokenId: number, amount: number) {
      const contracts = useContract()
      return contracts.market.functions.sell(
        nftType,
        tokenId,
        ethers.utils.parseUnits(amount.toString(), 'ether')
      )
    },
    async buy(nftType: number, tokenId: number, amount: string) {
      const contracts = useContract()
      return contracts.market.functions.buy(nftType, tokenId, amount)
    },
    async cancel(nftType: number, tokenId: number) {
      const contracts = useContract()
      return contracts.market.functions.cancel(nftType, tokenId)
    },
    getCommanders(offset: number, limit: number, queryParams?: any) {
      const searchParams = new URLSearchParams(queryParams)
      return axios.get(
        `http://localhost:8080/commanders?offset=${offset}&limit=${limit}&${searchParams}`
      )
    },
    getKnights(offset: number, limit: number, queryParams?: any) {
      return axios.get(
        `http://localhost:8080/knights?offset=${offset}&limit=${limit}`
      )
    },
  },
})
