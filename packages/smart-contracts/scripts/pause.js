module.exports = async (callback) => {
  const Game = artifacts.require("Game");
  const game = await Game.deployed();
  await game.setPaused(false);

  try {
    await game.addGuildMembers(1, [1, 2], [1, 2, 3]);
  } catch (error) {
    console.log(error);
  }

  const myGuild = await game.getMyGuild(1);
  myGuild.forEach((element) => {
    console.log(element.toString());
  });
  //console.log(myGuild);

  callback();
};
