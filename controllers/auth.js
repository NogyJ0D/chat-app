const UserModel = require('../models/User')
const { Op } = require('sequelize')

class AuthController {
  getLoginView (req, res) {
    if (req.session.user) return res.redirect('/')
    const token = req.csrfToken()

    return res.render('login', {
      layout: './layouts/home',
      title: 'Login',
      csrfToken: token,
      flash: req.flash()
    })
  }

  getSignupView (req, res) {
    if (req.session.user) return res.redirect('/')
    const token = req.csrfToken()
    return res.render('signup', {
      layout: './layouts/home',
      title: 'Signup',
      csrfToken: token,
      flash: req.flash()
    })
  }

  async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await UserModel.findOne({
        where: { email }
      })

      if (!user) {
        req.flash('errorAuth', 'El usuario no existe.')
        return res.redirect('/auth/login')
      }

      if (user.email !== email || user.password !== password) {
        req.flash('errorAuth', 'Las credenciales no coinciden.')
        return res.redirect('/auth/login')
      }

      delete user.password
      req.session.user = user

      // global.io().emit('hello')

      return res.redirect('/user')
    } catch (err) {
      console.log(err)
      req.flash('errorAuth', 'Error inesperado.')
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
      if (exists) {
        req.flash('errorAuth', 'El usuario/email ya está registrado.')
        return res.redirect('/auth/signup')
      }

      const data = req.body
      if (!data.profile_pic) delete data.profile_pic
      let newUser = await UserModel.create(data)

      newUser = newUser.dataValues
      delete newUser.password
      req.session.user = newUser
      console.log(req.session.user)
      return res.redirect('/user')
    } catch (err) {
      console.log(err)
      req.flash('errorAuth', 'Error inesperado.')
      return res.redirect('/auth/signup')
    }
  }

  async logout (req, res) {
    req.session.destroy()
    return res.redirect('/')
  }
}

module.exports = AuthController
