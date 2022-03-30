const express = require('express')
const AuthController = require('../controllers/auth')

const router = express.Router()
const authController = new AuthController()

router.get('/login', authController.getLoginView)
router.post('/login', authController.login)

router.get('/signup', authController.getSignupView)
router.post('/signup', authController.signup)

module.exports = router
