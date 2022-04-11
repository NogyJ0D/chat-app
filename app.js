const express = require('express')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const csrf = require('csurf')
const methodOverride = require('method-override')
const { join } = require('path')
const cookieParser = require('cookie-parser')

const { port } = require('./config')
const { sessionSecret } = require('./config')
// const Sockets = require('./controllers/socket')

// Importing routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const friendshipRoutes = require('./routes/friendship')
const messageRoutes = require('./routes/message')

const app = express()

// Database
const { connection } = require('./config/database')
connection()

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
app.use(flash())
app.use(methodOverride('_method'))
app.use(csrf())
app.use(cookieParser())

// Start
const server = app.listen(port, () => { console.log('Server and sockets listening on port:', port) })
const io = require('socket.io')(server)
require('./sockets')(io)

// Routing
authRoutes(app)
userRoutes(app)
friendshipRoutes(app)
messageRoutes(app)

app.get('/', (req, res) => {
  res.render('home', {
    user: req.session.user || null,
    layout: './layouts/home',
    title: 'Home'
  })
})
