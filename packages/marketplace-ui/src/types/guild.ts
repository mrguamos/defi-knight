import type { Common } from './common'

export type Guild = Common & {
  emblem: string
  morale: number
  combatPower: number
  winRate: number
  name: string
}