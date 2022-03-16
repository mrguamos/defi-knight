import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { usePriceManager } from './price-manager-store'
import { useContract } from './contract-store'
import { ethers, BigNumberish, providers } from 'ethers'

export const useKnight = defineStore('knight', {
  state: () => {
    return {
      iKnight: undefined as unknown as ethers.utils.Interface,
    }
  },
  actions: {
    async mintKnight(): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      const mintFee = await usePriceManager().getPresaleFee()
      return contracts.game.functions.mintKnightPresale({
        value: mintFee,
        gasLimit: 300000,
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
    isApprovedForAll() {
      const contracts = useContract()
      const account = useAccount()
      return contracts.knight.isApprovedForAll(
        account.address,
        contracts.market.address
      )
    },
    setApprovalForAll() {
      const contracts = useContract()
      return contracts.knight.functions.setApprovalForAll(
        contracts.market.address,
        true
      )
    },
    safeTransferFrom(to: string, tokenId: number) {
      const contracts = useContract()
      return contracts.knight.transferFrom(useAccount().address, to, tokenId)
    },
  },
})
