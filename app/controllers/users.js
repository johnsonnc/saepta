/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  utils = require('../../lib/utils'),
  _ = require('underscore')

  var login = function(req, res) {
    if (req.session.returnTo) {
      res.redirect(req.session.returnTo)
      delete req.session.returnTo
      return
    }
    res.redirect('/')
}

exports.signin = function(req, res) {}

/**
 * Auth callback
 */

exports.authCallback = login

/**
 * Show login form
 */

exports.login = function(req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}

/**
 * Show sign up form
 */

exports.signup = function(req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  })
}

/**
 * Logout
 */

exports.logout = function(req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 * Session
 */

exports.session = login

/**
 * Create user
 */

exports.create = function(req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function(err) {
    if (err) {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      })
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

exports.update = function(req, res) {
  console.log("got here")
  User.update({
    _id: req.user.id
  }, {
    $set: {
      company: req.body.companyId
    }
  }, function(err, user) {

    if (!err) {
      return res.redirect('/users/' + user._id)
    }

    res.render('users/show', {
      title: 'User' + user._id,
      user: user,
      errors: err.errors
    })


  })
}

/**
 *  Show profile
 */

exports.show = function(req, res) {
  var user = req.profile
  var Company = mongoose.model('Company')
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

/**
 * Find user by id
 */

exports.user = function(req, res, next, id) {
  var Company = mongoose.model('Company')
  User
    .findOne({
      _id: id
    })
    .populate('company', 'name id')
    .exec(function(err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}