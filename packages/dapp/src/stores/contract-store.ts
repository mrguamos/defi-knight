import { defineStore } from 'pinia'
import commanderABI from 'smart-contracts/build/contracts/Commander.json'
import dkABI from 'smart-contracts/build/contracts/DefiKnight.json'
import gameABI from 'smart-contracts/build/contracts/Game.json'
import guildABI from 'smart-contracts/build/contracts/Guild.json'
import knightABI from 'smart-contracts/build/contracts/Knight.json'
import { useWeb3 } from './web3-store'

export const useContract = defineStore('contracts', {
  state: () => {
    return {
      dk: undefined as unknown,
      commander: undefined as unknown,
      knight: undefined as unknown,
      guild: undefined as unknown,
      game: undefined as unknown,
    }
  },
  actions: {
    init() {
      const eth = useWeb3()
      const networkId = import.meta.env.VITE_APP_NETWORK_ID || 1337

      // this.dk = new eth.web3.eth.Contract(
      //   dkABI.abi as AbiItem[],
      //   dkABI.networks[networkId as keyof typeof dkABI.networks].address
      // )

      // this.commander = new eth.web3.eth.Contract(
      //   commanderABI.abi as AbiItem[],
      //   commanderABI.networks[
      //     networkId as keyof typeof commanderABI.networks
      //   ].address
      // )

      // this.knight = new eth.web3.eth.Contract(
      //   knightABI.abi as AbiItem[],
      //   knightABI.networks[networkId as keyof typeof knightABI.networks].address
      // )
      // this.guild = new eth.web3.eth.Contract(
      //   guildABI.abi as AbiItem[],
      //   guildABI.networks[networkId as keyof typeof guildABI.networks].address
      // )

      // this.game = new eth.web3.eth.Contract(
      //   gameABI.abi as AbiItem[],
      //   gameABI.networks[networkId as keyof typeof gameABI.networks].address
      // )
    },
  },
})
