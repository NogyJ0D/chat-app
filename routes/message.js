const { Router } = require('express')
const MessageController = require('../controllers/message')

module.exports = app => {
  const messageController = new MessageController()
  const router = Router()
  app.use('/message', router)

  router.post('/send-message/chat-id/:chatId', messageController.sendMessage)
}
