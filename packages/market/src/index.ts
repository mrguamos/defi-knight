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

import { Sequelize, ModelStatic, Op } from 'sequelize'

import express from 'express'

import cors from 'cors'

const networkId = process.env.NETWORK_ID || 1337

// const rpc = 'http://localhost:8545'
const rpc = 'ws://localhost:8545'

// const provider = new ethers.providers.JsonRpcProvider(rpc)
const provider = new ethers.providers.WebSocketProvider(rpc)

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
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })

    market.on('ListingEvent', async (nftType, tokenId) => {
      console.log(nftType, tokenId)
      const listing = (await market.functions.getListing(nftType, tokenId))[0]

      let nft
      let props

      if (nftType == 0) {
        nft = (await commander.functions.getCommander(tokenId))[0]
        props = {
          isGenesis: nft.isGenesis,
          rarity: nft.rarity,
          gender: nft.gender,
          class: nft.class,
        }
      } else if (nftType == 1) {
        nft = (await knight.functions.getKnight(tokenId))[0]
        props = {
          combatPower: nft.combatPower,
          rarity: nft.rarity,
          gender: nft.gender,
          class: nft.class,
          isGenesis: nft.isGenesis,
        }
      } else if (nftType == 2) {
        nft = (await guild.functions.getGuild(tokenId))[0]
      }

      const _listing = {
        owner: listing.owner,
        amount: listing.amount.toString(),
      }

      let data = {
        id: tokenId.toString(),
        status: 0,
      }

      if ((listing.amount as BigNumber).gt(1)) {
        data = {
          id: tokenId.toString(),
          ...props,
          ..._listing,
          status: 1,
        }
      }
      try {
        if (nftType == 0) {
          Commander.upsert(data)
        }
        if (nftType == 1) {
          Knight.upsert(data)
        }
      } catch (error: any) {
        console.log(error.toString())
      }
    })
  } catch (error) {
    console.log(error)
  }
})()

const app = express()
app.use(cors())

app.get('/commanders', async (req: express.Request, res: express.Response) => {
  try {
    const { offset, limit, min, max, address, listed, race, genesis } =
      req.query
    let owner = {}

    if (Number(limit) > 100) {
      res.status(400).send()
      return
    }

    if (!address) {
      res.status(400).send()
      return
    }

    if (listed === '0') {
      owner = Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('owner')),
        Op.ne,
        Sequelize.fn('lower', address)
      )
    } else {
      owner = Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('owner')),
        Sequelize.fn('lower', address)
      )
    }

    const where = []

    if (race) {
      where.push({
        class: {
          [Op.in]: race.toString().split(','),
        },
      })
    }

    if (min) {
      where.push({
        rarity: {
          [Op.gte]: min,
        },
      })
    }
    if (max) {
      where.push({
        rarity: {
          [Op.lte]: max,
        },
      })
    }

    if (genesis) {
      where.push({
        isGenesis: {
          [Op.in]: genesis.toString().split(','),
        },
      })
    }

    const commanders = await Commander.findAndCountAll({
      where: Sequelize.and([
        where,
        {
          status: 1,
          owner,
        },
      ]),
      offset: Number(offset),
      limit: Number(limit),
    })
    res.send(commanders)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
})

app.get('/knights', async (req: express.Request, res: express.Response) => {
  try {
    const {
      offset,
      limit,
      min,
      max,
      address,
      listed,
      race,
      genesis,
      minCP,
      maxCP,
    } = req.query
    let owner = {}

    if (Number(limit) > 100) {
      res.status(400).send()
      return
    }

    if (!address) {
      res.status(400).send()
      return
    }

    if (listed === '0') {
      owner = Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('owner')),
        Op.ne,
        Sequelize.fn('lower', address)
      )
    } else {
      owner = Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('owner')),
        Sequelize.fn('lower', address)
      )
    }

    const where = []

    if (race) {
      where.push({
        class: {
          [Op.in]: race.toString().split(','),
        },
      })
    }

    if (min) {
      where.push({
        rarity: {
          [Op.gte]: min,
        },
      })
    }
    if (max) {
      where.push({
        rarity: {
          [Op.lte]: max,
        },
      })
    }

    if (genesis) {
      where.push({
        isGenesis: {
          [Op.in]: genesis.toString().split(','),
        },
      })
    }

    if (minCP) {
      where.push({
        combatPower: {
          [Op.gte]: minCP,
        },
      })
    }
    if (maxCP) {
      where.push({
        combatPower: {
          [Op.lte]: maxCP,
        },
      })
    }

    const knights = await Knight.findAndCountAll({
      where: Sequelize.and([
        where,
        {
          status: 1,
          owner,
        },
      ]),
      offset: Number(offset),
      limit: Number(limit),
    })
    res.send(knights)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
})

const port = 8080

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
