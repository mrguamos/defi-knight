import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
import BN from 'bn.js'

export const useKnight = defineStore('knight', {
  state: () => {
    return {}
  },
  actions: {
    mintKnight() {
      const contracts = useContract()
      const account = useAccount()
      return contracts.game.methods.mintKnightPresale().send({
        value: Web3.utils.toWei('0.00001', 'ether').toString(),
        from: account.address,
      })
    },
    isPresale() {
      const contracts = useContract()
      return contracts.knight.methods.isPresale().call()
    },
    async getKnights() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.knight.methods.balanceOf(account.address).call(),
        10
      )
      const tokens: Promise<BN[]> = Promise.all(
        [...Array(balance).keys()].map((_, i) =>
          contracts.knight.methods
            .tokenOfOwnerByIndex(account.address, i)
            .call()
        )
      )
      return tokens
    },
    getKnight(tokenId: number) {
      const contracts = useContract()
      return contracts.knight.methods.getKnight(tokenId).call()
    },
    async getLastIndexKnight() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.knight.methods.balanceOf(account.address).call(),
        10
      )
      return contracts.knight.methods
        .tokenOfOwnerByIndex(account.address, balance - 1)
        .call()
    },
  },
})
