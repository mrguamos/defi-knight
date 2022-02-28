import { defineStore } from 'pinia'
import commanderABI from 'smart-contracts/build/contracts/Commander.json'
import dkABI from 'smart-contracts/build/contracts/DefiKnight.json'
import gameABI from 'smart-contracts/build/contracts/Game.json'
import guildABI from 'smart-contracts/build/contracts/Guild.json'
import knightABI from 'smart-contracts/build/contracts/Knight.json'
import { useWeb3 } from './web3-store'
import { ethers } from 'ethers'
import { markRaw } from 'vue'
import { useCommander } from './commander-store'

export const useContract = defineStore('contracts', {
  state: () => {
    return {
      dk: undefined as unknown as ethers.Contract,
      commander: undefined as unknown as ethers.Contract,
      knight: undefined as unknown as ethers.Contract,
      guild: undefined as unknown as ethers.Contract,
      game: undefined as unknown as ethers.Contract,
    }
  },
  actions: {
    init() {
      const eth = useWeb3()
      const commanderStore = useCommander()
      const networkId = import.meta.env.VITE_APP_NETWORK_ID || 1337

      this.dk = markRaw(
        new ethers.Contract(
          dkABI.networks[networkId as keyof typeof dkABI.networks].address,
          dkABI.abi,
          eth.signer
        )
      )

      this.commander = markRaw(
        new ethers.Contract(
          commanderABI.networks[
            networkId as keyof typeof commanderABI.networks
          ].address,
          commanderABI.abi,
          eth.signer
        )
      )
      commanderStore.iCommander = markRaw(
        new ethers.utils.Interface(commanderABI.abi)
      )

      this.knight = markRaw(
        new ethers.Contract(
          knightABI.networks[
            networkId as keyof typeof knightABI.networks
          ].address,
          knightABI.abi,
          eth.signer
        )
      )

      this.guild = markRaw(
        new ethers.Contract(
          guildABI.networks[
            networkId as keyof typeof guildABI.networks
          ].address,
          guildABI.abi,
          eth.signer
        )
      )

      this.game = markRaw(
        new ethers.Contract(
          gameABI.networks[networkId as keyof typeof gameABI.networks].address,
          gameABI.abi,
          eth.signer
        )
      )
    },
  },
})
