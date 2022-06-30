import type { Common } from './common'

export type Guild = Common & {
  emblem: number
  morale: number
  combatPower: number
  winRate: number
  name: string
}
