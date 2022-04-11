const { Router } = require('express')
const UserController = require('../controllers/user')

module.exports = app => {
  const userController = new UserController()
  const router = Router()
  app.use('/user', router)

  router.get('/', userController.getChatsView)
  router.get('/contacts', userController.getContactsView)
  router.get('/profile', userController.getProfileView)
  router.get('/chat/:friendshipId', userController.getChatView)
}
