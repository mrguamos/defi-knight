import { Sequelize, DataTypes } from 'sequelize'

module.exports = function (sequelize: Sequelize) {
  return sequelize.define(
    'Config',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      schema: 'defiknight',
      tableName: 'config',
    }
  )
}
