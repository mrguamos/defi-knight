import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
import axios from 'axios'
import type { BigNumberish } from 'ethers'
import type { Knight } from '../types/knight'
export const useKnight = defineStore('knight', {
  state: () => {
    return {
      list: {
        data: [] as Knight[],
        total: 0,
        currentPage: 1,
      },
      filter: {
        id: undefined as unknown as number,
        race: [] as number[],
        genesis: [] as number[],
        min: 0,
        max: 4,
        minCP: 0,
        maxCP: 250,
      },
      bonus: 0,
    }
  },
  getters: {
    pagesNumber(): number {
      return Math.ceil(this.list.total / 2)
    },
    paginatedKnights(): Knight[] {
      const start = (this.list.currentPage - 1) * 10
      return this.list.data.slice(start, start + 10)
    },
  },
  actions: {
    async listKnights(queryParams: Record<string, string>) {
      const params = new URLSearchParams(queryParams).toString()
      return axios.get(`http://localhost:8080/knights?${params}`)
    },
    async listedKnights(queryParams: Record<string, string>) {
      const params = new URLSearchParams(queryParams).toString()
      return axios.get(`http://localhost:8080/knights?${params}`)
    },
    async getKnights() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.knight.functions.balanceOf(account.address),
        10
      )

      const tokens: Promise<BigNumberish[]> = Promise.all(
        [...Array(balance).keys()].map((_, i) =>
          contracts.knight.functions.tokenOfOwnerByIndex(account.address, i)
        )
      )
      return tokens
    },
    getKnight(tokenId: BigNumberish) {
      const contracts = useContract()
      return contracts.knight.functions.getKnight(tokenId.toString())
    },
    async getLastIndexKnight() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.knight.functions.balanceOf(account.address),
        10
      )
      return contracts.knight.functions.tokenOfOwnerByIndex(
        account.address,
        balance - 1
      )
    },
    isApprovedForAll(address: string) {
      const contracts = useContract()
      const account = useAccount()
      return contracts.knight.isApprovedForAll(account.address, address)
    },
    setApprovalForAll(address: string) {
      const contracts = useContract()
      return contracts.knight.functions.setApprovalForAll(address, true)
    },
    safeTransferFrom(to: string, tokenId: number) {
      const contracts = useContract()
      return contracts.knight.transferFrom(useAccount().address, to, tokenId)
    },
    getBonus() {
      const contracts = useContract()
      return contracts.knight.BONUS_POWER()
    },
    ownerOf(tokenId: number) {
      const contracts = useContract()
      return contracts.knight.ownerOf(tokenId)
    },
  },
})
