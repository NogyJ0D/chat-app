const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Message = sequelize.define( // Modelo
  'messages', // Tabla
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'chats',
      referencesKey: 'id'
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'users',
      referencesKey: 'id'
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: 'users',
      referencesKey: 'id'
    },
    text: {
      type: DataTypes.STRING(510),
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }
)

module.exports = Message
