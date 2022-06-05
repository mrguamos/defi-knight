import type { Commander } from './commander'
import type { Knight } from './knight'

export type MarketCommon = {
  amount: string
  owner: string
  sold: boolean
  tokenId: number
}

export type CommanderMarket = Commander &
  MarketCommon & {
    //
  }

export type KnightMarket = Knight &
  MarketCommon & {
    //
  }
