const ChatModel = require('../models/Chat')
const FriendshipController = require('./friendship')
const { sequelize } = require('../config/database')
const MessageController = require('./message')
const { DateTime } = require('luxon')

class ChatController {
  static async getChatByFriendship (friendshipId, userId) {
    return await ChatModel.findOne({
      where: { friendship_id: friendshipId }
    })
      .then(res => {
        if (res && (res.user_one_id === userId || res.user_two_id === userId)) return res
        else return null
      })
  }

  static async createChat (friendship) {
    return await ChatModel.create({
      user_one_id: friendship.user_one_id,
      user_two_id: friendship.user_two_id,
      friendship_id: friendship.id
    })
      .then(res => {
        res.dataValues.messages = []
        return res.dataValues
      })
  }

  static async openChat (friendshipId, userId) {
    const friendship = await FriendshipController.getById(friendshipId)
    if (friendship.fail) return { fail: true, message: 'No existe amistad entre ustedes.' }

    const chat = await this.getChatByFriendship(friendshipId, userId)
    if (chat) {
      chat.messages = await MessageController.getMessages(chat.id)
      chat.messages.forEach(message => {
        message.createdAt = DateTime.fromJSDate(message.createdAt).toFormat('dd/MM t')
      })
      return chat
    }

    return await this.createChat(friendship)
  }

  static async getUserChats (userId) {
    const chats = await sequelize.query(`
      (SELECT chats.*, users.username, users.profile_pic
        FROM chats
          JOIN users ON users.id = user_one_id
            WHERE user_two_id = ${userId})
      UNION
      (SELECT chats.*, users.username, users.profile_pic
        FROM chats
          JOIN users ON users.id = user_two_id
            WHERE user_one_id = ${userId});
    `, { type: sequelize.QueryTypes.SELECT })

    return chats
  }
}

module.exports = ChatController
