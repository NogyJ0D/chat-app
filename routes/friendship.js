const express = require('express')
const FriendshipController = require('../controllers/friendship')

const router = express.Router()
const friendshipController = new FriendshipController()

router.post('/add-friend', friendshipController.addFriend)

module.exports = router
