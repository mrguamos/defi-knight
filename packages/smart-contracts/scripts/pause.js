module.exports = async (callback) => {
  const Game = artifacts.require("Game");
  const game = await Game.deployed();
  await game.setPaused(false);
  callback();
};
