module.exports = async (callback) => {
  const Game = artifacts.require("PriceManager");
  const game = await Game.deployed();
  //stable fee in wei = 0.001 eth
  await game.setStableFee("1000000000000000");
  callback();
};
