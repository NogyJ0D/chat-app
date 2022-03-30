const express = require('express')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const { join } = require('path')

const config = require('./config')
const { sessionSecret } = require('./config')

const app = express()

// Database
const { connection } = require('./config/database')
connection()
const UserModel = require('./models/User')
UserModel.sync()

// EJS
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, 'static')))
app.use(expressLayouts)
app.set('layout', 'home', 'panel')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}))

// Routing
const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)
const userRoutes = require('./routes/user')
app.use('/user', userRoutes)
const friendshipRoutes = require('./routes/friendship')
app.use('/friendship', friendshipRoutes)

// Start
app.listen(config.port, () => { console.log('Working on port:', config.port) })

app.get('/', (req, res) => {
  res.render('home', {
    user: req.session.user || null,
    layout: './layouts/home',
    title: 'Home'
  })
})
