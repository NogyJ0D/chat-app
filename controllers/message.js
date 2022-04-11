const MessageModel = require('../models/Message')
const ChatModel = require('../models/Chat')

class MessageController {
  static async getMessages (chatId) {
    const messages = await MessageModel.findAll({
      where: { chat_id: chatId }
    })

    return messages
  }

  async sendMessage (req, res) {
    const { text } = req.body
    const userId = req.session?.user?.id
    if (!text || !userId) return res.status(400)

    let chat = await ChatModel.findOne({
      where: { id: req.params.chatId }
    })

    if (!chat) chat = { fail: true, message: 'No existe ese chat.' }
    else if (chat.user_one_id !== userId && chat.user_two_id !== userId) chat = { fail: true, message: 'No eres parte de esa amistad.' }

    if (chat.fail) {
      req.flash('errorChat', chat.message)
      return res.redirect('/user')
    }

    const data = {
      chat_id: chat.id,
      sender_id: userId,
      receiver_id: userId === chat.user_one_id ? chat.user_two_id : chat.user_one_id,
      text
    }

    await MessageModel.create(data, { raw: true })
    return res.status(201).json({ success: true })
  }
}

module.exports = MessageController
