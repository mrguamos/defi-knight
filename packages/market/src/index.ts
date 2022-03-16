import {
  abi as marketABI,
  networks as marketNetworks,
} from 'smart-contracts/build/contracts/Market.json'
import { ethers, BigNumber } from 'ethers'
import {
  abi as commanderABI,
  networks as commanderNetworks,
} from 'smart-contracts/build/contracts/Commander.json'
import {
  abi as knightABI,
  networks as knightNetworks,
} from 'smart-contracts/build/contracts/Knight.json'
import {
  abi as guildABI,
  networks as guildNetworks,
} from 'smart-contracts/build/contracts/Guild.json'

import { Sequelize, ModelStatic, Model } from 'sequelize'

import express from 'express'

import cors from 'cors'

const networkId = process.env.NETWORK_ID || 1337

const rpc = 'http://localhost:8545'

const provider = new ethers.providers.JsonRpcProvider(rpc)

const iMarket = new ethers.utils.Interface(marketABI)
const market = new ethers.Contract(
  marketNetworks[networkId as keyof typeof marketNetworks].address,
  marketABI,
  provider
)

const commander = new ethers.Contract(
  commanderNetworks[networkId as keyof typeof commanderNetworks].address,
  commanderABI,
  provider
)

const knight = new ethers.Contract(
  knightNetworks[networkId as keyof typeof knightNetworks].address,
  knightABI,
  provider
)

const guild = new ethers.Contract(
  guildNetworks[networkId as keyof typeof guildNetworks].address,
  guildABI,
  provider
)
const connectionString =
  'postgres://kkdapqey:smZCA6X5Uk260hINQCYGRzIRWDpMErU7@john.db.elephantsql.com/kkdapqey'

const sequelize = new Sequelize(connectionString, {
  logging: false,
})
const Commander = require(`${__dirname}/commander`)(
  sequelize
) as ModelStatic<any>
const Knight = require(`${__dirname}/knight`)(sequelize) as ModelStatic<any>
const Config = require(`${__dirname}/config`)(sequelize) as ModelStatic<any>

;(async () => {
  await sequelize.authenticate()
  await sequelize.sync({ alter: true })

  while (true) {
    const block = await provider.getBlockNumber()
    const lastBlock = (await Config.findByPk('block'))?.value || block - 1000

    const filter = market.filters.ListingEvent()
    const events = await market.queryFilter(
      filter,
      Number(lastBlock) + 1,
      block
    )
    for (const event of events) {
      const res = iMarket.decodeEventLog(
        event.event as string,
        event.data,
        event.topics
      )
      const listing = (
        await market.functions.getListing(res.nftType, res.tokenId)
      )[0]

      let nft
      let props

      if (res.nftType == 0) {
        nft = (await commander.functions.getCommander(res.tokenId))[0]
        props = {
          isGenesis: nft.isGenesis,
          rarity: nft.rarity,
          gender: nft.gender,
          class: nft.class,
        }
      } else if (res.nftType == 1) {
        nft = (await knight.functions.getKnight(res.tokenId))[0]
        props = {
          combatPower: nft.combatPower,
          bonusPower: nft.bonusPower,
          rarity: nft.rarity,
          gender: nft.gender,
          class: nft.class,
        }
      } else if (res.nftType == 2) {
        nft = (await guild.functions.getGuild(res.tokenId))[0]
      }

      const _listing = {
        owner: listing.owner,
        amount: listing.amount.toString(),
      }

      let data = {
        id: res.tokenId.toString(),
        status: 0,
      }

      if ((listing.amount as BigNumber).gt(1)) {
        data = {
          id: res.tokenId.toString(),
          ...props,
          ..._listing,
          status: 1,
        }
      }
      try {
        if (res.nftType == 0) {
          Commander.upsert(data)
        }
        if (res.nftType == 1) {
          Knight.upsert(data)
        }
      } catch (error: any) {
        console.log(error.toString())
      }
    }

    Config.upsert({
      id: 'block',
      value: block,
    })
    await new Promise((r) => setTimeout(r, 5000))
  }
})()

const app = express()
app.use(cors())

app.get('/commanders', async (req: express.Request, res: express.Response) => {
  const { offset, limit, rarity } = req.query
  const commanders = await Commander.findAndCountAll({
    where: {
      status: 1,
    },
    offset: Number(offset),
    limit: Number(limit),
  })
  res.send(commanders)
})

app.get('/knights', async (req: express.Request, res: express.Response) => {
  const { offset, limit } = req.query
  const commanders = await Knight.findAndCountAll({
    where: {
      status: 1,
    },
    offset: Number(offset),
    limit: Number(limit),
  })
  res.send(commanders)
})

const port = 8080

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// server.route({
//   method: 'GET',
//   url: '/commanders',
//   schema: {
//     querystring: {
//       page: { type: 'integer' },
//     },
//   },
//   handler: async (request, reply) => {
//     console.log(querystring.parse(request.query.toString()))

//     const commanders = await Commander.findAndCountAll({
//       where: {
//         status: 1,
//       },
//       offset: 10,
//       limit: 2,
//     })
//     return commanders
//   },
// })

// server.get('/knights', async (request, reply) => {
//   const knights = await Knight.findAndCountAll({
//     where: {
//       status: 1,
//     },
//     offset: 10,
//     limit: 2,
//   })
//   return knights
// })
