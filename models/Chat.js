const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Chat = sequelize.define( // Modelo
  'chats', // Tabla
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },

    friendship_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'friendships',
        referencesKey: 'id'
      }
    },

    user_one_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        referencesKey: 'id'
      }
    },
    user_two_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        referencesKey: 'id'
      }
    },
    pending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }
)

// Chat.sync({ alter: true })

module.exports = Chat
