import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
import { ethers, BigNumberish, providers } from 'ethers'

export const useKnight = defineStore('knight', {
  state: () => {
    return {}
  },
  actions: {
    mintKnight(): Promise<providers.TransactionResponse> {
      const contracts = useContract()

      return contracts.game.functions.mintKnightPresale({
        value: ethers.utils.parseUnits('0.00001', 'ether'),
        gasLimit: 300000,
      })
    },
    isPresale() {
      const contracts = useContract()
      return contracts.knight.functions.isPresale()
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
  },
})
