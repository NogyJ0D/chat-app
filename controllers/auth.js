const UserModel = require('../models/User')
const { Op } = require('sequelize')

class AuthController {
  getLoginView (req, res) {
    if (req.session.user) return res.redirect('/')
    return res.render('login', {
      layout: './layouts/home',
      title: 'Login'
    })
  }

  getSignupView (req, res) {
    if (req.session.user) return res.redirect('/')
    return res.render('signup', {
      layout: './layouts/home',
      title: 'Signup'
    })
  }

  async login (req, res) {
    try {
      const { email, password } = req.body
      let user = await UserModel.findOne({
        where: { email }
      })

      if (!user) {
        return res.redirect('/auth/login')
      }
      user = user.dataValues

      if (user.email !== email || user.password !== password) {
        return res.redirect('/auth/login')
      }

      delete user.password
      req.session.user = user
      return res.redirect('/user')
    } catch (err) {
      console.log(err)
      return res.redirect('/auth/login')
    }
  }

  async signup (req, res) {
    try {
      const exists = await UserModel.findOne({
        where: {
          [Op.or]:
            [
              { email: req.body.email },
              { username: req.body.username }
            ]
        }
      })
      if (exists) return res.redirect('/auth/signup')

      const data = req.body
      if (!data.profile_pic) delete data.profile_pic
      const newUser = await UserModel.create(data)

      req.session.user = newUser.dataValues
      return res.redirect('/user')
    } catch (err) {
      console.log(err)
      return res.redirect('/auth/signup')
    }
  }
}

module.exports = AuthController
