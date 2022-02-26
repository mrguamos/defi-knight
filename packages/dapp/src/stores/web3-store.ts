import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
import Moralis from 'moralis'
// eslint-disable-next-line
declare let window: any

export const useWeb3 = defineStore('web3', {
  state: () => {
    return {}
  },
  actions: {
    async init() {
      const account = useAccount()
      const serverUrl = 'https://fyl6j8gl9zhd.usemoralis.com:2053/server'
      const appId = 'eFVrqYn7N4hRoPESX8rqmr21KGkC9WbvNgZGjbug'
      await Moralis.start({ serverUrl, appId })
      await account.init()
    },
    async connect(provider?: Moralis.Web3ProviderType) {
      const account = useAccount()
      await Moralis.authenticate({
        signingMessage: 'Log in using Moralis',
        provider: provider,
      })
      await account.init()
    },
    async logout() {
      await Moralis.User.logOut()
      useAccount().$reset()
    },
  },
})

const handleAccountsChanged = async (accounts: string[]) => {
  useAccount().$reset()
  if (accounts.length > 0) {
    const account = useAccount()
  }
}

const handleChainChanged = async (chainId: string) => {
  useAccount().$reset()
  const _chainId = parseInt(chainId, 16)
  if (_chainId === (Number(import.meta.env.VITE_APP_NETWORK_ID) || 1337)) {
    // await useWeb3().connect()
  }
}

const registerListeners = () => {
  window.ethereum.on('accountsChanged', handleAccountsChanged)
  window.ethereum.on('chainChanged', handleChainChanged)
}
