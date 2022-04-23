import { defineStore } from 'pinia'
import {
  abi as commanderABI,
  networks as commanderNetworks,
} from 'smart-contracts/build/contracts/Commander.json'
import {
  abi as dkABI,
  networks as dkNetworks,
} from 'smart-contracts/build/contracts/DefiKnight.json'
import {
  abi as gameABI,
  networks as gameNetworks,
} from 'smart-contracts/build/contracts/Game.json'
import {
  abi as guildABI,
  networks as guildNetworks,
} from 'smart-contracts/build/contracts/Guild.json'
import {
  abi as knightABI,
  networks as knightNetworks,
} from 'smart-contracts/build/contracts/Knight.json'
import {
  abi as priceManagerABI,
  networks as priceManagerNetworks,
} from 'smart-contracts/build/contracts/PriceManager.json'
import {
  abi as marketABI,
  networks as marketNetworks,
} from 'smart-contracts/build/contracts/Market.json'
import {
  abi as guildMemberABI,
  networks as guildMemberNetworks,
} from 'smart-contracts/build/contracts/GuildMember.json'
import { useWeb3 } from './web3-store'
import { ethers } from 'ethers'
import { markRaw } from 'vue'
import { useCommander } from './commander-store'
import { useKnight } from './knight-store'
import { useGuild } from './guild-store'

export const useContract = defineStore('contracts', {
  state: () => {
    return {
      dk: undefined as unknown as ethers.Contract,
      commander: undefined as unknown as ethers.Contract,
      knight: undefined as unknown as ethers.Contract,
      guild: undefined as unknown as ethers.Contract,
      game: undefined as unknown as ethers.Contract,
      priceManager: undefined as unknown as ethers.Contract,
      market: undefined as unknown as ethers.Contract,
      guildMember: undefined as unknown as ethers.Contract,
    }
  },
  actions: {
    init() {
      const eth = useWeb3()
      const commanderStore = useCommander()
      const knightStore = useKnight()
      const guildStore = useGuild()
      const networkId = import.meta.env.VITE_APP_NETWORK_ID || 1337

      this.dk = markRaw(
        new ethers.Contract(
          dkNetworks[networkId as keyof typeof dkNetworks].address,
          dkABI,
          eth.signer
        )
      )

      this.commander = markRaw(
        new ethers.Contract(
          commanderNetworks[
            networkId as keyof typeof commanderNetworks
          ].address,
          commanderABI,
          eth.signer
        )
      )
      commanderStore.iCommander = markRaw(
        new ethers.utils.Interface(commanderABI)
      )

      this.knight = markRaw(
        new ethers.Contract(
          knightNetworks[networkId as keyof typeof knightNetworks].address,
          knightABI,
          eth.signer
        )
      )

      knightStore.iKnight = markRaw(new ethers.utils.Interface(knightABI))

      this.guild = markRaw(
        new ethers.Contract(
          guildNetworks[networkId as keyof typeof guildNetworks].address,
          guildABI,
          eth.signer
        )
      )

      guildStore.iGuild = markRaw(new ethers.utils.Interface(guildABI))

      this.game = markRaw(
        new ethers.Contract(
          gameNetworks[networkId as keyof typeof gameNetworks].address,
          gameABI,
          eth.signer
        )
      )

      this.priceManager = markRaw(
        new ethers.Contract(
          priceManagerNetworks[
            networkId as keyof typeof priceManagerNetworks
          ].address,
          priceManagerABI,
          eth.signer
        )
      )

      this.market = markRaw(
        new ethers.Contract(
          marketNetworks[networkId as keyof typeof marketNetworks].address,
          marketABI,
          eth.signer
        )
      )

      this.guildMember = markRaw(
        new ethers.Contract(
          guildMemberNetworks[
            networkId as keyof typeof guildMemberNetworks
          ].address,
          guildMemberABI,
          eth.signer
        )
      )
    },
  },
})
