import { defineStore } from 'pinia'
import { useAccount } from './account-store'
import { useContract } from './contract-store'
import { ethers, providers } from 'ethers'
import { markRaw } from 'vue'

// eslint-disable-next-line
declare let window: any

export const useWeb3 = defineStore('web3', {
  state: () => {
    return {
      signer: undefined as unknown as providers.JsonRpcSigner,
      provider: undefined as unknown as providers.Web3Provider,
      isWrongNetwork: false,
    }
  },
  actions: {
    async connect() {
      this.isWrongNetwork = false

      if (typeof window.ethereum !== 'undefined') {
        registerListeners()
        const chainId = parseInt(
          await window.ethereum.request({ method: 'eth_chainId' }),
          16
        )

        if (chainId !== (Number(import.meta.env.VITE_APP_NETWORK_ID) || 1337)) {
          this.isWrongNetwork = true
          return
        }
        this.provider = markRaw(
          new ethers.providers.Web3Provider(window.ethereum)
        )
        const address = (await this.provider.send('eth_requestAccounts', []))[0]
        this.signer = markRaw(this.provider.getSigner())
        const account = useAccount()
        const contracts = useContract()
        contracts.init()

        await account.init(address)
        return
      }
      this.isWrongNetwork = true
      alert('Please install metamask')
    },
  },
})

const handleAccountsChanged = async (accounts: string[]) => {
  useAccount().$reset()
  const chainId = parseInt(
    await window.ethereum.request({ method: 'eth_chainId' }),
    16
  )
  if (chainId !== (Number(import.meta.env.VITE_APP_NETWORK_ID) || 1337)) {
    useWeb3().isWrongNetwork = true
    return
  }
  if (accounts.length > 0) {
    const account = useAccount()
    await account.init(accounts[0])
  }
}

const handleChainChanged = async (chainId: string) => {
  useAccount().$reset()
  const _chainId = parseInt(chainId, 16)
  if (_chainId === (Number(import.meta.env.VITE_APP_NETWORK_ID) || 1337)) {
    await useWeb3().connect()
    return
  }
  useWeb3().isWrongNetwork = true
}

const registerListeners = () => {
  window.ethereum.on('accountsChanged', handleAccountsChanged)
  window.ethereum.on('chainChanged', handleChainChanged)
}
