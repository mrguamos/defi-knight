import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
import axios from 'axios'
import type { BigNumberish } from 'ethers'
import type { Commander } from '../types/commander'
export const useCommander = defineStore('commander', {
  state: () => {
    return {
      list: {
        data: [] as Commander[],
        total: 0,
        currentPage: 1,
      },
      filter: {
        id: undefined as unknown as number,
        race: [] as number[],
        genesis: [] as number[],
        min: 0,
        max: 4,
      },
      bonus: 0,
    }
  },
  getters: {
    pagesNumber(): number {
      return Math.ceil(this.list.total / 20)
    },
    paginatedCommanders(): Commander[] {
      const start = (this.list.currentPage - 1) * 20
      return this.list.data.slice(start, start + 20)
    },
  },
  actions: {
    async listCommanders(queryParams: Record<string, string>) {
      const params = new URLSearchParams(queryParams).toString()
      return axios.get(`http://localhost:8080/commanders?${params}`)
    },
    async listedCommanders(queryParams: Record<string, string>) {
      const params = new URLSearchParams(queryParams).toString()
      return axios.get(`http://localhost:8080/commanders?${params}`)
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
    getBonus() {
      const contracts = useContract()
      return contracts.commander.BONUS_MAX_WR()
    },
    ownerOf(tokenId: number) {
      const contracts = useContract()
      return contracts.commander.ownerOf(tokenId)
    },
  },
})
