const reward = {
  maxLevel: 25,
  maxSubLevel: 9,
  minCP: 50,
  maxCP: 6250,
  cpIncrement: 25,
  levelIncrement: 250,
  wrIncrement: 5,
  minWR: 30,
  maxWR: 70,
  minAmount: 10,
  amountIncrement: 4,
};

module.exports = async (callback) => {
  const Rewards = artifacts.require("Rewards");
  const rewards = await Rewards.deployed();
  //stable fee in wei = 0.001 eth
  await rewards.updateReward(reward);
  callback();
};
