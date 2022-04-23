const { cp } = require("fs");

const commanderTokens = [];
const knightTokens = [];
let knightCap = 0;

module.exports = async (callback, deployer, network, accounts) => {
  try {
    const Game = artifacts.require("Game");
    const game = await Game.deployed();
    const Web3 = require("web3");
    const ethers = require("ethers");
    const Commander = artifacts.require("Commander");
    const commander = await Commander.deployed();
    const Knight = artifacts.require("Knight");
    const knight = await Knight.deployed();
    const Guild = artifacts.require("Guild");
    const guild = await Guild.deployed();
    const GuildMember = artifacts.require("GuildMember");
    const guildMember = await GuildMember.deployed();

    const guildToken = await guild.tokenOfOwnerByIndex(config.from, 0);

    let gmt = await knight.balanceOf(guildMember.address);
    console.log("# of knights: " + gmt.toString());
    gmt = await commander.balanceOf(guildMember.address);
    console.log("# of commanders: " + gmt.toString());

    console.log(guildMember.address);
    console.log(await commander.ownerOf(1));
    await game.disbandGuild(guildToken.toString());
  } catch (error) {
    console.log(error);
  } finally {
    callback();
  }
};
