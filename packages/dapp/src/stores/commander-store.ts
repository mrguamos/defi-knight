import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { usePriceManager } from './price-manager-store'
import { useContract } from './contract-store'
import { ethers, BigNumberish, providers } from 'ethers'

export const useCommander = defineStore('commander', {
  state: () => {
    return {
      iCommander: undefined as unknown as ethers.utils.Interface,
      loading: false,
    }
  },
  actions: {
    async mintCommander(): Promise<providers.TransactionResponse> {
      const contracts = useContract()
      const mintFee = await usePriceManager().getPresaleFee()
      return contracts.game.functions.mintCommanderPresale({
        value: mintFee,
        gasLimit: 300000,
      })
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
    isApprovedForAll() {
      const contracts = useContract()
      const account = useAccount()
      return contracts.commander.isApprovedForAll(
        account.address,
        contracts.market.address
      )
    },
    setApprovalForAll() {
      const contracts = useContract()
      return contracts.commander.functions.setApprovalForAll(
        contracts.market.address,
        true
      )
    },
    safeTransferFrom(to: string, tokenId: number) {
      const contracts = useContract()
      return contracts.commander.transferFrom(useAccount().address, to, tokenId)
    },
  },
})
