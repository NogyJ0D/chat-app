const { Router } = require('express')
const FriendshipController = require('../controllers/friendship')

module.exports = app => {
  const friendshipController = new FriendshipController()
  const router = Router()
  app.use('/friendship', router)

  router.post('/add-friend', friendshipController.addFriend)
  router.put('/accept-friend/friendship-id/:friendshipId', friendshipController.acceptFriendship)
  router.delete('/delete-friend/friendship-id/:friendshipId', friendshipController.deleteFriendship)
}
