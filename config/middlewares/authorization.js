/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    return res.redirect('/login')
  }
  next()
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
}

/*
 *  Article authorization routing middleware
 */

exports.agenda = {
  hasAuthorization: function(req, res, next) {
    if (req.agenda.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/agenda/' + req.agenda.id)
    }
    next()
  }
}
exports.meeting = {
  hasAuthorization: function(req, res, next) {
    if (req.agenda.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/meeting/' + req.agenda.id)
    }
    next()
  }
}
exports.company = {
  hasAuthorization: function(req, res, next) {
    if (req.agenda.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/company/' + req.agenda.id)
    }
    next()
  }
}
exports.topic = {
  hasAuthorization: function(req, res, next) {
    if (req.agenda.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/topic/' + req.agenda.id)
    }
    next()
  }
}