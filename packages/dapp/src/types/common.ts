import { Market } from './market'

export type Common = Market & {
  id: number
}

export type CharacterCommon = Common & {
  class: number
  rarity: number
  gender: number
}
