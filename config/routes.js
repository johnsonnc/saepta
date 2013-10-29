/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users'),
  meetings = require('../app/controllers/meetings'),
  agendas = require('../app/controllers/agendas'),
  topics = require('../app/controllers/topics'),
  companies = require('../app/controllers/companies'),
  home = require('../app/controllers/homes'),
  auth = require('./middlewares/authorization')

  /**
   * Route middlewares
   */

var companyAuth = [auth.requiresLogin, auth.company.hasAuthorization]
var agendaAuth = [auth.requiresLogin, auth.agenda.hasAuthorization]
var meetingAuth = [auth.requiresLogin, auth.meeting.hasAuthorization]
var topicAuth = [auth.requiresLogin, auth.topic.hasAuthorization]


/**
 * Expose routes
 */

module.exports = function(app, passport) {

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/users/:userId', users.show)
  app.post('/users/:userId', users.update)
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin)
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin)
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback)

  app.param('userId', users.user)

  app.get('/', home.index) // need to modify it.

  // company routes
  app.get('/companies', companies.index)
  app.get('/companies/new', auth.requiresLogin, companies.new)
  app.post('/companies', auth.requiresLogin, companies.create)
  app.get('/companies/:companyId', companies.show)
  app.get('/companies/:companyId/edit', companyAuth, companies.edit)
  app.put('/companies/:companyId', companyAuth, companies.update)
  app.del('/companies/:companyId', companyAuth, companies.destroy)

  app.param('companyId', companies.load) // might have to adjust



  // topics routes
  app.get('/topics', topics.index)
  app.get('/topics/new', auth.requiresLogin, topics.new)
  app.post('/topics', auth.requiresLogin, topics.create)
  app.get('/topics/:topicId', topics.show)
  app.get('/topics/:topicId/edit', topicAuth, topics.edit)
  app.put('/topics/:topicId', topicAuth, topics.update)
  app.del('/topics/:topicId', topicAuth, topics.destroy)
  // comment routes
  var topicComments = require('../app/controllers/comments')
  app.post('/topics/:topicId/comments', auth.requiresLogin, topicComments.create)
  app.get('/topics/:topicId/comments', auth.requiresLogin, topicComments.create)

  app.param('topicId', topics.load) // might have to adjust

  // agendas routes
  app.get('/agendas', agendas.index)
  app.get('/agendas/new', auth.requiresLogin, agendas.new)
  app.post('/agendas', auth.requiresLogin, agendas.create)
  app.get('/agendas/:id', agendas.show)
  app.get('/agendas/:id/edit', agendaAuth, agendas.edit)
  app.put('/agendas/:id', agendaAuth, agendas.update)
  app.del('/agendas/:id', agendaAuth, agendas.destroy)
  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/agendas/:id/comments', auth.requiresLogin, comments.create)
  app.get('/agendas/:id/comments', auth.requiresLogin, comments.create)

  app.param('agendaId', agendas.load) // might have to adjust

  // home route

  // meetings routes
  app.get('/meetings', meetings.index)
  app.get('/meetings/new', auth.requiresLogin, meetings.new)
  app.post('/meetings', auth.requiresLogin, meetings.create)
  app.get('/meetings/:meetingId', meetings.show)
  app.get('/meetings/:meetingId/edit', meetingAuth, meetings.edit)
  app.put('/meetings/:meetingId', meetingAuth, meetings.update)
  app.del('/meetings/:meetingId', meetingAuth, meetings.destroy)
  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/meetings/:meetingId/comments', auth.requiresLogin, comments.create)
  app.get('/meetings/:meetingId/comments', auth.requiresLogin, comments.create)

  app.param('meetingId', meetings.load) // might have to adjust

  // home route
  app.get('/search/meeting', auth.requiresLogin, meetings.search)
  app.get('/search/topic', auth.requiresLogin, topics.search)
  app.get('/search/agenda', auth.requiresLogin, agendas.search)
  app.get('/search/company', auth.requiresLogin, companies.search)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}