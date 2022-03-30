const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Friendship = sequelize.define( // Modelo
  'friendships', // Tabla
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_one_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'users',
      referencesKey: 'id'
    },
    user_two_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'users',
      referencesKey: 'id'
    },
    pending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }
)

module.exports = Friendship
