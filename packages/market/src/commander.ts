import { Sequelize, DataTypes, ModelStatic } from 'sequelize'

module.exports = function (sequelize: Sequelize) {
  return sequelize.define(
    'Commander',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rarity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      class: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isGenesis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      schema: 'defiknight',
      tableName: 'commanders',
    }
  )
}
