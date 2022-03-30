const FriendshipModel = require('../models/Friendship')
const UserController = require('./user')

const userController = new UserController()

class FriendshipController {
  async addFriend (req, res) {
    if (!req.body.friendUsername) return res.redirect('/user/contacts')
    if (req.body.friendUsername === req.session.user.username) return res.redirect('/user/contacts')

    const { id } = req.session.user
    const friend = await userController.findByUsername(req.body.friendUsername)
    console.log(friend)
    // TODO:
  }
}

module.exports = FriendshipController
