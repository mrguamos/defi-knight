const { cp } = require("fs");

const commanderTokens = [];
const knightTokens = [];
let knightCap = 0;

module.exports = async (callback, deployer, network, accounts) => {
  try {
    const Game = artifacts.require("Game");

    const game = await Game.deployed();
    const Guild = artifacts.require("Guild");
    const guild = await Guild.deployed();
    const GuildMember = artifacts.require("GuildMember");
    const guildMember = await GuildMember.deployed();
    const Commander = artifacts.require("Commander");
    const commander = await Commander.deployed();
    const Knight = artifacts.require("Knight");
    const knight = await Knight.deployed();

    const guildTokenCount = await guild.balanceOf(config.from);
    const guildToken = await guild.tokenOfOwnerByIndex(config.from, 0);
    console.log(guildToken.toString());

    //collect commanders
    const myCommandersCount = await commander.balanceOf(config.from);
    for (let i = 0; i < parseInt(myCommandersCount.toString()); i++) {
      const commanderToken = (
        await commander.tokenOfOwnerByIndex(config.from, i)
      ).toString();
      commanderTokens[i] = commanderToken;
    }

    //collect knights
    const myKnightCount = await knight.balanceOf(config.from);
    for (let i = 0; i < parseInt(myKnightCount.toString()); i++) {
      const knightToken = (
        await knight.tokenOfOwnerByIndex(config.from, i)
      ).toString();
      knightTokens[i] = knightToken;
    }

    //add guild members
    await game.addGuildMembers(guildToken, commanderTokens, knightTokens);

    // check balances, tokens, guild stats here
    const myGuildCommanders = await game.getMyGuildCommanders(
      guildToken.toString()
    );
    console.log(myGuildCommanders.toString());
    const myGuildKnights = await game.getMyGuildKnights(guildToken.toString());
    console.log(myGuildKnights.toString());
  } catch (error) {
    console.log(error);
  } finally {
    callback();
  }
};
