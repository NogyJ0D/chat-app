const { Sequelize } = require('sequelize')
const { dbName, dbUser, dbPassword, dbPort, dbHost } = require('.')

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: 'mysql',
  port: dbPort,
  host: dbHost,
  logging: false,
  query: { raw: true }
})

const connection = async () => {
  try {
    await sequelize.authenticate()
    // await sequelize.sync({ alter: true })
    console.log('Connected to', dbName)
  } catch (err) {
    console.log('Database connection failed.')
    console.log(err)
  }
}

module.exports = { sequelize, connection }
