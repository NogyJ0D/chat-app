const UserModel = require('../models/User')

class UserController {
  getChatsView (req, res) {
    if (!req.session.user) return res.redirect('/')
    return res.render('chats', {
      user: req.session.user,
      layout: './layouts/panel',
      title: 'Chats'
    })
  }

  getContactsView (req, res) {
    if (!req.session.user) return res.redirect('/')
    return res.render('contacts', {
      user: req.session.user,
      layout: './layouts/panel',
      title: 'Contacts'
    })
  }

  getProfileView (req, res) {
    if (!req.session.user) return res.redirect('/')
    return res.render('profile', {
      user: req.session.user,
      layout: './layouts/panel',
      title: 'Profile'
    })
  }

  async findByUsername (username) {
    const user = await UserModel.findOne({
      where: { username }
    })

    if (!user) return { fail: true, message: 'No existe un usuario con ese email' }

    delete user.dataValues.birthday
    delete user.dataValues.password
    delete user.dataValues.createdAt
    delete user.dataValues.updatedAt

    return user.dataValues
  }
}

module.exports = UserController
