import { networks as marketNetworks } from 'smart-contracts/build/contracts/Market.json'
import { networks as gameNetworks } from 'smart-contracts/build/contracts/Game.json'

const networkId = process.env.VITE_APP_NETWORK_ID || 1337

const marketAddress = marketNetworks[networkId].address

const marketDesc = 'ListingEvent'

const marketTableName = 'ListingEvents'

const marketTopic =
  '0xaa1674ed6e2eef34ca058861e0e6ab28d32a73022f9ad865611bb3803a23bcd8'

const gameAddress = gameNetworks[networkId].address

const combatDesc = 'CombatEvents'

const combatTableName = 'CombatEvents'

const combatTopic =
  '0x123ab16ee8bb2b76be6cce699641f70134faff2eb2a86dc02f5fb97c864a1395'
