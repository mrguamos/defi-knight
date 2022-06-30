import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { usePriceManager } from './price-manager-store'
import { useContract } from './contract-store'
import { ethers, BigNumberish, providers } from 'ethers'

export const useKnight = defineStore('knight', {
  state: () => {
    return {
      iKnight: undefined as unknown as ethers.utils.Interface,
      bonus: 0,
    }
  },
  actions: {
    async mintKnight(): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      const mintFee = await usePriceManager().getStableFee()
      return contracts.game.functions.mintKnight({
        value: mintFee,
        gasLimit: 400000,
      })
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
    getKnight(tokenId: number) {
      const contracts = useContract()
      return contracts.knight.functions.getKnight(tokenId)
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
    async getKnightsByIds(tokenIds: number[]) {
      const contracts = useContract()
      return contracts.knight.functions.getKnightsByIds(tokenIds)
    },
    async getTotalKnights() {
      const contracts = useContract()
      return contracts.knight.counter()
    },
  },
})
