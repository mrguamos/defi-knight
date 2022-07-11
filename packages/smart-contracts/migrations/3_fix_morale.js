const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const Game = artifacts.require("Game");
const Guild = artifacts.require("Guild");

module.exports = async function (deployer) {
  const game = await Game.deployed();
  const guild = await Guild.deployed();
  await upgradeProxy(game.address, Game, { deployer });
  await upgradeProxy(guild.address, Guild, { deployer });
  console.log("Upgraded");
};
