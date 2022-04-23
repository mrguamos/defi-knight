const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const Web3 = require("web3");
const DefiKnight = artifacts.require("DefiKnight");
const Commander = artifacts.require("Commander");
const Knight = artifacts.require("Knight");
const Guild = artifacts.require("Guild");
const GuildMember = artifacts.require("GuildMember");
const CommanderMinter = artifacts.require("CommanderMinter");
const KnightMinter = artifacts.require("KnightMinter");
const LocalCommanderMinter = artifacts.require("LocalCommanderMinter");
const LocalKnightMinter = artifacts.require("LocalKnightMinter");
const Game = artifacts.require("Game");
const LocalOracle = artifacts.require("LocalOracle");
const Oracle = artifacts.require("Oracle");
const Morale = artifacts.require("Morale");
const GuildHelper = artifacts.require("GuildHelper");
const PriceManager = artifacts.require("PriceManager");
const Market = artifacts.require("Market");

module.exports = async (deployer, network, accounts) => {
  let vrf = "";
  let link = "";
  let keyHash = "";
  let fee;

  let commanderMinter;
  let knightMinter;
  let oracle;

  if (
    network === "development" ||
    network === "develop" ||
    network === "bsctestnet"
  ) {
    await deployer.deploy(
      DefiKnight,
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000"
    );
  } else {
    await deployer.deploy(
      DefiKnight,
      "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
      "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    );
  }

  const defiKnight = await DefiKnight.deployed();
  if (
    network === "development" ||
    network === "develop" ||
    network === "bsctestnet"
  ) {
    oracle = (await deployer.deploy(LocalOracle, 1)).address;
  } else {
    const priceFeed = "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee";
    oracle = (await deployer.deploy(Oracle, priceFeed)).address;
  }

  const priceManager = await deployProxy(
    PriceManager,
    [oracle, defiKnight.address],
    {
      deployer,
    }
  );

  const commander = await deployProxy(Commander, [priceManager.address], {
    deployer,
  });
  const knight = await deployProxy(Knight, [priceManager.address], {
    deployer,
  });
  const guildHelper = await deployProxy(
    GuildHelper,
    [commander.address, knight.address],
    {
      deployer,
    }
  );
  const guild = await deployProxy(
    Guild,
    [commander.address, knight.address, guildHelper.address],
    {
      deployer,
    }
  );

  const guildMember = await deployProxy(GuildMember, [], {
    deployer,
  });

  await guildHelper.setGuildAddress(guild.address);
  const morale = await deployProxy(Morale, { deployer });

  //   if (network === "bsctestnet") {
  //     vrf = "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C";
  //     link = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06";
  //     keyHash =
  //       "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186";
  //     fee = web3.utils.toWei("0.1").toString();
  //     commanderMinter = await deployer.deploy(
  //       CommanderMinter,
  //       vrf,
  //       link,
  //       keyHash,
  //       fee,
  //       commander.address
  //     );
  //     knightMinter = await deployer.deploy(
  //       KnightMinter,
  //       vrf,
  //       link,
  //       keyHash,
  //       fee,
  //       knight.address
  //     );
  //   } else if (network === "polygontestnet") {
  //     vrf = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
  //     link = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  //     keyHash =
  //       "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4";
  //     fee = web3.utils.toWei("0.0001").toString();
  //     commanderMinter = await deployer.deploy(
  //       CommanderMinter,
  //       vrf,
  //       link,
  //       keyHash,
  //       fee,
  //       commander.address
  //     );
  //     knightMinter = await deployer.deploy(
  //       KnightMinter,
  //       vrf,
  //       link,
  //       keyHash,
  //       fee,
  //       knight.address
  //     );
  //   } else if (network === "development" || network === "develop") {
  //     commanderMinter = await deployer.deploy(
  //       LocalCommanderMinter,
  //       commander.address
  //     );
  //     knightMinter = await deployer.deploy(LocalKnightMinter, knight.address);
  //   }

  commanderMinter = await deployer.deploy(
    LocalCommanderMinter,
    commander.address
  );
  knightMinter = await deployer.deploy(LocalKnightMinter, knight.address);

  const game = await deployProxy(
    Game,
    [
      defiKnight.address,
      commander.address,
      knight.address,
      guild.address,
      guildMember.address,
      knightMinter.address,
      commanderMinter.address,
      morale.address,
      priceManager.address,
    ],
    { deployer }
  );

  const COMMANDER_MINTER = await commanderMinter.MINTER_ROLE();
  await commanderMinter.grantRole(COMMANDER_MINTER, game.address);

  const KNIGHT_MINTER = await knightMinter.MINTER_ROLE();
  await knightMinter.grantRole(KNIGHT_MINTER, game.address);

  const NFT_KNIGHT_MINTER = await knight.MINTER_ROLE();
  await knight.grantRole(NFT_KNIGHT_MINTER, knightMinter.address);

  const NFT_COMMANDER_MINTER = await commander.MINTER_ROLE();
  await commander.grantRole(NFT_COMMANDER_MINTER, commanderMinter.address);

  const NFT_GUILD_MINTER = await guild.MINTER_ROLE();
  await guild.grantRole(NFT_GUILD_MINTER, game.address);

  const GAME_ADMIN_ROLE = await guild.GAME_ADMIN_ROLE();
  await guild.grantRole(GAME_ADMIN_ROLE, game.address);

  await defiKnight.setTaxRecipientAddress(game.address);

  await guildMember.grantRole(
    await guildMember.GAME_ADMIN_ROLE(),
    game.address
  );
  await guildMember.approveGameContract(game.address);

  const market = await deployProxy(
    Market,
    [defiKnight.address, commander.address, knight.address, guild.address],
    { deployer }
  );
};
