import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
import BN from 'bn.js'

export const useGuild = defineStore('guild', {
  state: () => {
    return {}
  },
  actions: {
    mintGuild(name: string) {
      const contracts = useContract()
      const account = useAccount()
      return contracts.game.methods.mintGuild(Web3.utils.fromAscii(name)).send({
        from: account.address,
      })
    },
    isPresale() {
      const contracts = useContract()
      return contracts.guild.methods.isPresale().call()
    },
    async getGuilds() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.guild.methods.balanceOf(account.address).call(),
        10
      )
      const tokens: Promise<BN[]> = Promise.all(
        [...Array(balance).keys()].map((_, i) =>
          contracts.guild.methods.tokenOfOwnerByIndex(account.address, i).call()
        )
      )
      return tokens
    },
    getGuild(tokenId: number) {
      const contracts = useContract()
      return contracts.guild.methods.getGuild(tokenId).call()
    },
    async getLastIndexGuild() {
      const contracts = useContract()
      const account = useAccount()
      const balance = parseInt(
        await contracts.guild.methods.balanceOf(account.address).call(),
        10
      )
      return contracts.guild.methods
        .tokenOfOwnerByIndex(account.address, balance - 1)
        .call()
    },
  },
})
