import { networks as marketNetworks } from 'smart-contracts/build/contracts/Market.json'

const networkId = process.env.VITE_APP_NETWORK_ID || 1337

const address = marketNetworks[networkId].address

const desc = 'ListingEvent'

const tableName = 'ListingEvents'

const topic =
  '0xaa1674ed6e2eef34ca058861e0e6ab28d32a73022f9ad865611bb3803a23bcd8'
