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
  minAmount: 8,
  amountIncrement: 6,
};

module.exports = async (callback) => {
  try {
    const Rewards = artifacts.require("RewardsManager");
    const rewards = await Rewards.deployed();
    await rewards.updateReward(reward);
  } catch (error) {
    console.log(error);
  } finally {
    callback();
  }
};
