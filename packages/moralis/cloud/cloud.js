Moralis.Cloud.beforeSave('ListingEvents', async (request) => {
  //moralis docs
  const config = await Moralis.Config.get()
  const web3 = Moralis.web3ByChain(config.get('NETWORK_ID'))
  const logger = Moralis.Cloud.getLogger()
  const confirmed = request.object.get('confirmed')
  const abiMarket = [
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'nftType',
          type: 'uint8',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'getListing',
      outputs: [
        {
          components: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
          ],
          internalType: 'struct Market.Listing',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
  ]
  if (confirmed) {
    logger.info('confirmed beforeSave!')
    const nftType = request.object.get('nftType')
    const tokenId = request.object.get('tokenId')
    logger.info('nftType: ' + nftType + ' tokenId: ' + tokenId)
    const marketContract = new web3.eth.Contract(
      abiMarket,
      config.get('MARKET_ADDRESS')
    )
    const listing = await marketContract.methods
      .getListing(nftType, tokenId)
      .call()
    if (nftType == 0) {
      const abiCommander = [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getCommander',
          outputs: [
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'id',
                  type: 'uint256',
                },
                {
                  internalType: 'uint8',
                  name: 'rarity',
                  type: 'uint8',
                },
                {
                  internalType: 'uint8',
                  name: 'class',
                  type: 'uint8',
                },
                {
                  internalType: 'bool',
                  name: 'isGenesis',
                  type: 'bool',
                },
                {
                  internalType: 'uint8',
                  name: 'gender',
                  type: 'uint8',
                },
              ],
              internalType: 'struct Commander.CommanderState',
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          constant: true,
        },
      ]
      const contract = new web3.eth.Contract(
        abiCommander,
        config.get('COMMANDER_ADDRESS')
      )
      const c = await contract.methods.getCommander(tokenId).call()
      const Commander = Moralis.Object.extend('Commander')
      const query = new Moralis.Query(Commander)
      query.equalTo('tokenId', Number(tokenId))
      let commander = new Commander()
      const result = await query.first()
      if (result) {
        commander = result
      }
      commander.set('rarity', Number(c.rarity))
      commander.set('isGenesis', Boolean(c.isGenesis))
      commander.set('gender', Number(c.gender))
      commander.set('class', Number(c.class))
      commander.set('owner', listing.owner.toLowerCase())
      commander.set('amount', listing.amount)
      commander.set('tokenId', Number(tokenId))
      commander.set('status', 1)
      if (web3.utils.toBN(listing.owner).isZero()) {
        commander.set('status', 0)
      }
      await commander.save()
    } else if (nftType == 1) {
      const abiKnight = [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getKnight',
          outputs: [
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'id',
                  type: 'uint256',
                },
                {
                  internalType: 'uint8',
                  name: 'rarity',
                  type: 'uint8',
                },
                {
                  internalType: 'uint8',
                  name: 'class',
                  type: 'uint8',
                },
                {
                  internalType: 'uint8',
                  name: 'gender',
                  type: 'uint8',
                },
                {
                  internalType: 'uint16',
                  name: 'combatPower',
                  type: 'uint16',
                },
                {
                  internalType: 'bool',
                  name: 'isGenesis',
                  type: 'bool',
                },
              ],
              internalType: 'struct Knight.KnightState',
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          constant: true,
        },
      ]
      const contract = new web3.eth.Contract(
        abiKnight,
        config.get('KNIGHT_ADDRESS')
      )
      const k = await contract.methods.getKnight(tokenId).call()
      const Knight = Moralis.Object.extend('Knight')
      const query = new Moralis.Query(Knight)
      query.equalTo('tokenId', Number(tokenId))
      let knight = new Knight()
      const result = await query.first()
      if (result) {
        knight = result
      }
      knight.set('rarity', Number(k.rarity))
      knight.set('isGenesis', Boolean(k.isGenesis))
      knight.set('gender', Number(k.gender))
      knight.set('class', Number(k.class))
      knight.set('owner', listing.owner.toLowerCase())
      knight.set('amount', listing.amount)
      knight.set('tokenId', Number(tokenId))
      knight.set('status', 1)
      knight.set('combatPower', Number(k.combatPower))
      if (web3.utils.toBN(listing.owner).isZero()) {
        knight.set('status', 0)
      }
      await knight.save()
    }
  } else {
    logger.info('unconfirmed beforeSave!')
  }
})

Moralis.Cloud.define('commanders', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const limit = request.params.limit
  const offset = request.params.offset
  const address = request.params.address
  const listed = request.params.listed
  const race = request.params.race
  const min = request.params.min
  const max = request.params.max
  const genesis = request.params.genesis
  const Commander = Moralis.Object.extend('Commander')
  const query = new Moralis.Query(Commander)
  const gender = request.params.gender

  if (!offset) {
    throw 'Offset required.'
  }
  if (!limit) {
    throw 'Limit required.'
  }
  if (Number(limit) > 100) {
    throw 'Limit should not be greater than 100.'
  }
  if (!listed) {
    throw 'Listed required.'
  }
  if (listed !== '0' && listed !== '1') {
    throw 'Listed should be 1 or 0.'
  }

  if (race) {
    const races = race.toString().split(',')
    const rr = []
    races.forEach((r) => {
      rr.push(Number(r))
    })
    query.containedIn('class', rr)
  }

  if (min) {
    query.greaterThanOrEqualTo('rarity', Number(min))
  }

  if (max) {
    query.lessThanOrEqualTo('rarity', Number(max))
  }

  if (genesis) {
    const genesiss = genesis.toString().split(',')
    const gg = []
    genesiss.forEach((g) => {
      gg.push(Boolean(Number(g)))
    })
    query.containedIn('isGenesis', gg)
  }

  if (gender) {
    const genders = gender.toString().split(',')
    const gg = []
    genders.forEach((g) => {
      gg.push(Number(g))
    })
    query.containedIn('gender', gg)
  }

  query.equalTo('owner', address.toLowerCase())
  if (Number(listed) == 0) {
    query.notEqualTo('owner', address.toLowerCase())
  }

  query.equalTo('status', 1)
  query.skip(Number(offset))
  query.limit(Number(limit))
  query.withCount()
  const response = await query.find()
  return response
})

Moralis.Cloud.define('knights', async (request) => {
  const logger = Moralis.Cloud.getLogger()
  const limit = request.params.limit
  const offset = request.params.offset
  const address = request.params.address
  const listed = request.params.listed
  const race = request.params.race
  const min = request.params.min
  const max = request.params.max
  const minCP = request.params.minCP
  const maxCP = request.params.maxCP
  const genesis = request.params.genesis
  const Knight = Moralis.Object.extend('Knight')
  const query = new Moralis.Query(Knight)
  const gender = request.params.gender

  if (!offset) {
    throw 'Offset required.'
  }
  if (!limit) {
    throw 'Limit required.'
  }
  if (Number(limit) > 100) {
    throw 'Limit should not be greater than 100.'
  }
  if (!listed) {
    throw 'Listed required.'
  }
  if (listed !== '0' && listed !== '1') {
    throw 'Listed should be 1 or 0.'
  }

  if (race) {
    const races = race.toString().split(',')
    const rr = []
    races.forEach((r) => {
      rr.push(Number(r))
    })
    query.containedIn('class', rr)
  }

  if (min) {
    query.greaterThanOrEqualTo('rarity', Number(min))
  }

  if (max) {
    query.lessThanOrEqualTo('rarity', Number(max))
  }

  if (minCP) {
    query.greaterThanOrEqualTo('combatPower', Number(minCP))
  }

  if (maxCP) {
    query.lessThanOrEqualTo('combatPower', Number(maxCP))
  }

  if (genesis) {
    const genesiss = genesis.toString().split(',')
    const gg = []
    genesiss.forEach((g) => {
      gg.push(Number(g))
    })
    query.containedIn('isGenesis', gg)
  }

  if (gender) {
    const genders = gender.toString().split(',')
    const gg = []
    genders.forEach((g) => {
      gg.push(Boolean(Number(g)))
    })
    query.containedIn('gender', gg)
  }

  query.equalTo('owner', address.toLowerCase())
  if (Number(listed) == 0) {
    query.notEqualTo('owner', address.toLowerCase())
  }

  query.equalTo('status', 1)
  query.skip(Number(offset))
  query.limit(Number(limit))
  query.withCount()
  const response = await query.find()
  return response
})

Moralis.Cloud.beforeSave('CombatEvents', async (request) => {
  //moralis docs
  const config = await Moralis.Config.get()
  const web3 = Moralis.web3ByChain(config.get('NETWORK_ID'))
  const logger = Moralis.Cloud.getLogger()
  const confirmed = request.object.get('confirmed')
  const abiGame = [
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'combatId',
          type: 'uint256',
        },
      ],
      name: 'getCombatHistory',
      outputs: [
        {
          components: [
            {
              internalType: 'uint256',
              name: 'combatId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'guildId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'timestamp',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'level',
              type: 'uint8',
            },
          ],
          internalType: 'struct Game.Combat',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
  ]
  if (confirmed) {
    logger.info('confirmed beforeSave!')
    const combatId = request.object.get('combatId')
    logger.info('combatId: ' + combatId)
    const gameContract = new web3.eth.Contract(
      abiGame,
      config.get('GAME_ADDRESS')
    )
    const ch = await gameContract.methods.getCombatHistory(combatId).call()
    const CombatHistory = Moralis.Object.extend('CombatHistory')
    let combatHistory = new CombatHistory()
    combatHistory.set('combatId', Number(combatId))
    combatHistory.set('account', ch.account.toLowerCase())
    combatHistory.set('amount', ch.amount)
    combatHistory.set('guildId', Number(ch.guildId))
    combatHistory.set('block_timestamp', Number(ch.timestamp))
    combatHistory.set('level', Number(ch.level))
    await combatHistory.save()
  } else {
    logger.info('unconfirmed beforeSave!')
  }
})
