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

    await game.setPaused(false);

    //mint 5 commanders
    for (let f = 0; f != 5; f++) {
      await game.mintCommander({ value: Web3.utils.toWei("0.1", "ether") });
    }

    const myCommandersCount = await commander.balanceOf(config.from);

    //collect commander rarity to get knight cap, collect commander tokens for addGuildMembers call
    for (let i = 0; i < parseInt(myCommandersCount.toString()); i++) {
      const commanderToken = (
        await commander.tokenOfOwnerByIndex(config.from, i)
      ).toString();

      knightCap +=
        parseInt((await commander.getCommander(commanderToken)).rarity) + 1;

      console.log("Commander Token: " + commanderToken);
      commanderTokens[i] = commanderToken;
    }

    console.log("Knight Cap: " + knightCap);
    //mint knight based on knight cap from 5 commanders
    for (let i = 0; i < knightCap; i++) {
      await game.mintKnight({ value: Web3.utils.toWei("0.1", "ether") });
    }

    const myKnightCount = await knight.balanceOf(config.from);
    for (let i = 0; i < parseInt(myKnightCount.toString()); i++) {
      const knightToken = (
        await knight.tokenOfOwnerByIndex(config.from, i)
      ).toString();
      console.log("Knight Token: " + knightToken);
      knightTokens[i] = knightToken;
    }
    console.log("CL: " + commanderTokens.length);
    console.log("KL: " + knightTokens.length);

    // await game.mintGuild(ethers.utils.formatBytes32String("TEST"), {
    //   value: Web3.utils.toWei("0.1", "ether"),
    // });
  } catch (error) {
    console.log(error);
  } finally {
    callback();
  }
};
