const ethers = require("ethers");
module.exports = async (callback, a) => {
  try {
    const DefiKnight = artifacts.require("DefiKnight");
    const defiKnight = await DefiKnight.deployed();
    const Game = artifacts.require("Game");
    const game = await Game.deployed();
    const Market = artifacts.require("Market");
    const market = await Market.deployed();
    const Commander = artifacts.require("Commander");
    const commander = await Commander.deployed();
    const Knight = artifacts.require("Knight");
    const knight = await Knight.deployed();

    console.log("DefiKnight", defiKnight.address);
    console.log("Market", market.address);
    console.log("Game", game.address);
    console.log("Commmander", commander.address);
    console.log("Knight", knight.address);
  } catch (error) {
    console.log(error);
  } finally {
    callback();
  }
};
