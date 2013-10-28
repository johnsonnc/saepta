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
    if (req.meeting.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/agendas/' + req.agenda.id)
    }
    next()
  }
}
exports.meeting = {
  hasAuthorization: function(req, res, next) {
    if (req.meeting.creator.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/meetings/' + req.meeting.id)
    }
    next()
  }
}
exports.company = {
  hasAuthorization: function(req, res, next) {
    if (req.company.creator !== undefined && req.company.creator !== null) {
      if (req.company.creator.id != req.user.id) {
        req.flash('info', 'You are not authorized')
        return res.redirect('/companies/' + req.company.id)
      }
    } else {
      req.flash('info', 'Cannot verify your identy.')
      return res.redirect('/companies/' + req.company.id)
    }
    next()
  }
}
exports.topic = {
  hasAuthorization: function(req, res, next) {
    if (req.meeting.creator.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/topics/' + req.topic.id)
    }
    next()
  }
}