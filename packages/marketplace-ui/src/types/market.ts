import type { Commander } from './commander'
import type { Knight } from './knight'

export type CommanderMarket = Commander & {
  amount: string
  owner: string
}

export type KnightMarket = Knight & {
  amount: string
  owner: string
}
