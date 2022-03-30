const express = require('express')
const UserController = require('../controllers/user')

const router = express.Router()
const userController = new UserController()

router.get('/', userController.getChatsView)
router.get('/contacts', userController.getContactsView)
router.get('/profile', userController.getProfileView)

module.exports = router
