const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const User = sequelize.define( // Modelo
  'users', // Tabla
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: 'https://qvapay.com/img/profile/qvapay-default-profile.jpg'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
  // ,
  // {
  //   sequelize,
  //   modelName: 'User'
  // }
)

// User.sync({ alter: true })

module.exports = User
