const ethers = require("ethers");
module.exports = async (callback, a) => {
  try {
    const DefiKnight = artifacts.require("DefiKnight");
    const defiKnight = await DefiKnight.deployed();
    const Game = artifacts.require("Game");
    const game = await Game.deployed();
    const Commander = artifacts.require("Commander");
    const commander = await Commander.deployed();
    const Knight = artifacts.require("Knight");
    const knight = await Knight.deployed();
    const RewardsManager = artifacts.require("RewardsManager");
    const rewardsManager = await RewardsManager.deployed();
    await commander.setApprovalForAll(game.address, true);
    await knight.setApprovalForAll(game.address, true);
    await defiKnight.approve(
      game.address,
      new ethers.utils.BigNumber(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
    );
    for (let i = 0; i < 20; i++) {
      await game.mintCommander({
        value: 100000000000000000,
      });
      await game.mintKnight({
        value: 100000000000000000,
      });
    }

    for (let i = 0; i < 4; i++) {
      await game.mintGuild("0x");
      let comms = [1 + i * 5, 2 + i * 5, 3 + i * 5, 4 + i * 5, 5 + i * 5];
      let knights = [1 + i * 5, 2 + i * 5, 3 + i * 5, 4 + i * 5, 5 + i * 5];
      await game.addGuildMembers(i + 1, comms, knights);
      await game.buyMorale(i + 1);
      await game.conquer(i + 1, 1);
    }

    // let balance = await defiKnight.balanceOf(
    //   "0x816F7A84bA365963270Ca28f27a012Fd24ab0247"
    // );

    // console.log(ethers.utils.formatUnits(balance.toString(), "ether"));
    // const rewards = await rewardsManager.getAccountRewards(
    //   "0x816F7A84bA365963270Ca28f27a012Fd24ab0247"
    // );
    // console.log(ethers.utils.formatUnits(rewards.amount.toString(), "ether"));
    // await game.claim();
    // balance = await defiKnight.balanceOf(
    //   "0x816F7A84bA365963270Ca28f27a012Fd24ab0247"
    // );
    // console.log(ethers.utils.formatUnits(balance.toString(), "ether"));
  } catch (error) {
    console.log(error);
  } finally {
    callback();
  }
};
