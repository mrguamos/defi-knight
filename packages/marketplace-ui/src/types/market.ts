import type { Commander } from './commander'

export type CommanderMarket = Commander & {
  amount: string
  owner: string
}
