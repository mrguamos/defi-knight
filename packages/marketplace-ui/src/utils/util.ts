import type { EthersError } from '../types/EthersError'

export const getImageUrl = (name: string) => {
  return new URL(`/src/assets/${name}`, import.meta.url).href
}

export const isError = (error: any): error is EthersError => {
  return typeof error.code === 'number'
}
