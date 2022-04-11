const UserModel = require('../models/User')
const ChatController = require('./chat')
const FriendshipController = require('./friendship')

// const chatController = new ChatController()
// const friendshipController = FriendshipController()

class UserController {
  async getChatsView (req, res) {
    if (!req.session.user) return res.redirect('/')

    const chats = await ChatController.getUserChats(req.session.user.id)

    return res.render('chats', {
      user: req.session.user,
      layout: './layouts/panel',
      title: 'Chats',
      flash: req.flash(),
      chats
    })
  }

  async getContactsView (req, res) {
    if (!req.session.user) return res.redirect('/')

    const token = req.csrfToken()
    const pendingContacts = await FriendshipController.getUserPendings(req.session.user.id)
    const confirmedContacts = await FriendshipController.getUserContacts(req.session.user.id)

    return res.render('contacts', {
      user: req.session.user,
      layout: './layouts/panel',
      title: 'Contacts',
      csrfToken: token,
      flash: req.flash(),
      contacts: { pendingContacts, confirmedContacts }
    })
  }

  getProfileView (req, res) {
    if (!req.session.user) return res.redirect('/')

    const token = req.csrfToken()

    return res.render('profile', {
      user: req.session.user,
      layout: './layouts/panel',
      title: 'Profile',
      csrfToken: token
    })
  }

  async getChatView (req, res) {
    if (!req.session.user) return res.redirect('/')

    const chat = await ChatController.openChat(req.params.friendshipId, req.session.user.id)
    if (chat.fail) {
      req.flash('errorChat', chat.message)
      return res.redirect('/user')
    }

    let friendId
    chat.user_one_id === req.session.user.id
      ? friendId = chat.user_two_id
      : friendId = chat.user_one_id

    const friend = await UserModel.findOne({
      attributes: ['username', 'profile_pic', 'id'],
      where: {
        id: friendId
      }
    })

    return res.render('chat', {
      user: req.session.user,
      layout: './layouts/panel',
      title: 'Chat',
      csrfToken: req.csrfToken(),
      chat,
      friend
    })
  }
}

module.exports = UserController
