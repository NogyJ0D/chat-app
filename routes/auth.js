const { Router } = require('express')
const AuthController = require('../controllers/auth')

module.exports = (app) => {
  const authController = new AuthController()
  const router = Router()
  app.use('/auth', router)

  router.get('/login', authController.getLoginView)
  router.post('/login', authController.login)

  router.get('/signup', authController.getSignupView)
  router.post('/signup', authController.signup)

  router.get('/logout', authController.logout)
}
