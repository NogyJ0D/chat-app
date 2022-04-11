const FriendshipModel = require('../models/Friendship')
// const UserController = require('./user')
const UserModel = require('../models/User')
const { Op } = require('sequelize')
const { sequelize } = require('../config/database')

// const userController = new UserController()

class FriendshipController {
  async addFriend (req, res) {
    if (req.session.user) {
      if (!req.body.friendUsername) {
        req.flash('errorFriend', 'Debes ingresar un usuario.')
        return res.redirect('/user/contacts')
      }
      if (req.body.friendUsername === req.session.user.username) {
        req.flash('errorFriend', 'No puedes agregarte a ti mismo.')
        return res.redirect('/user/contacts')
      }

      const { id } = req.session.user
      const friendId = await UserModel.findOne({
        attributes: ['id'],
        where: { username: req.body.friendUsername }
      })

      if (!friendId) {
        req.flash('errorFriend', 'El usuario no existe.')
        return res.redirect('/user/contacts')
      }

      const exists = await FriendshipModel.findOne({
        where: {
          [Op.or]: [
            [
              { user_one_id: id },
              { user_two_id: friendId.id }
            ],
            [
              { user_one_id: friendId.id },
              { user_two_id: id }
            ]
          ]
        }
      })

      if (exists) {
        if (exists.pending) {
          req.flash('errorFriend', 'Ya le enviaste una petición.')
          return res.redirect('/user/contacts')
        } else {
          req.flash('errorFriend', 'Ese usuario ya es tu amigo.')
          return res.redirect('/user/contacts')
        }
      }

      await FriendshipModel.create({ user_one_id: id, user_two_id: friendId.id, pending: true })

      req.flash('successFriend', 'Petición enviada con éxito.')
      return res.redirect('/user/contacts')
    } else return res.redirect('/')
  }

  async acceptFriendship (req, res) {
    return await FriendshipModel.update(
      { pending: false },
      {
        where: {
          [Op.and]: [
            { id: req.params.friendshipId },
            { user_two_id: req.session.user.id }
          ]
        }
      }
    )
      .then(response => {
        return res.status(200).redirect('/user/contacts')
      })
      .catch(err => {
        console.log(err)
        return res.status(400).redirect('/user/contacts')
      })
  }

  async deleteFriendship (req, res) {
    return await FriendshipModel.destroy({
      where: {
        [Op.and]: [
          { id: req.params.friendshipId },
          {
            [Op.or]: [
              { user_one_id: req.session.user.id },
              { user_two_id: req.session.user.id }
            ]
          }
        ]
      }
    })
      .then(response => {
        return res.status(200).redirect('/user/contacts')
      })
      .catch(err => {
        console.log(err)
        return res.status(400).redirect('/user/contacts')
      })
  }

  static async getUserContacts (userId) {
    const confirmed = await sequelize.query(`
      (SELECT friendships.id, users.id as user_id, users.username, users.email, users.profile_pic 
        FROM friendships
          JOIN users ON users.id = user_two_id
            WHERE user_one_id = ${userId} AND pending = 0)
      UNION
      (SELECT friendships.id, users.id as user_id, users.username, users.email, users.profile_pic 
        FROM friendships
          JOIN users ON users.id = user_one_id
            WHERE user_two_id = ${userId} AND pending = 0);
    `, { type: sequelize.QueryTypes.SELECT })

    return confirmed
  }

  static async getUserPendings (userId) {
    const pendings = await sequelize.query(`
      SELECT friendships.id, users.id as user_id, users.username, users.email, users.profile_pic
        FROM friendships
          JOIN users ON users.id = user_one_id
            WHERE user_two_id = ${userId} and pending = 1
    `, { type: sequelize.QueryTypes.SELECT })
    return pendings
  }

  static async getById (friendshipId) {
    const friendship = await FriendshipModel.findOne({
      where: { id: friendshipId }
    })

    if (!friendship) return { fail: true }
    return friendship
  }
}

module.exports = FriendshipController
