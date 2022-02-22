import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'

import Moralis from 'moralis'

// eslint-disable-next-line
declare let window: any

export const useWeb3 = defineStore('web3', {
  state: () => {
    return {
      web3: undefined as unknown as Web3,
    }
  },
  actions: {
    async connect() {
      const options: Moralis.StartOptions = {
        serverUrl: 'https://fyl6j8gl9zhd.usemoralis.com:2053/server',
        appId: 'eFVrqYn7N4hRoPESX8rqmr21KGkC9WbvNgZGjbug',
      }

      Moralis.start(options)

      if (typeof window.ethereum !== 'undefined') {
        const chainId = parseInt(
          await window.ethereum.request({ method: 'eth_chainId' }),
          16
        )

        if (chainId !== (Number(import.meta.env.VITE_APP_NETWORK_ID) || 1337)) {
          throw new Error('Wrong network')
        }
        this.web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
        await this.web3.eth.requestAccounts()
        const contracts = useContract()
        contracts.init()
        registerListeners()
        await useAccount().init()
        return
      }
      alert('Please install metamask')
    },
  },
})

const handleAccountsChanged = (accounts: string[]) => {
  useAccount().$reset()
  if (accounts.length > 0) {
    const account = useAccount()
    account.init()
  }
}

const handleChainChanged = async (chainId: string) => {
  useAccount().$reset()
  const _chainId = parseInt(chainId, 16)
  if (_chainId === (Number(import.meta.env.VITE_APP_NETWORK_ID) || 1337)) {
    await useWeb3().connect()
  }
}

const registerListeners = () => {
  window.ethereum.on('accountsChanged', handleAccountsChanged)
  window.ethereum.on('chainChanged', handleChainChanged)
}
