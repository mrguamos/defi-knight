module.exports = async (callback) => {
  try {
    const Game = artifacts.require("PriceManager");
    const game = await Game.deployed();
    //default is 50000000000000000
    //stable fee in wei = 0.001 eth
    await game.setStableFee("1000000000000000");
    await game.setMintFee("5");
    await game.setGuildFee("5");
    await game.setEmblemFee("10");
    await game.setPotionCPFee("10");
    await game.setPotionWRFee("10");
  } catch (error) {
    console.log(error);
  } finally {
    callback();
  }
};
