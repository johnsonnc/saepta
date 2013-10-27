/** 
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Agenda = mongoose.model('Agenda'),
  utils = require('../../lib/utils'),
  _ = require('underscore')

  /**
   * Load
   */

  exports.load = function(req, res, next, id) {
    var User = mongoose.model('User')

    Agenda.load(id, function(err, agenda) {
      if (err) return next(err)
      if (!agenda) return next(new Error('not found'))
      req.agenda = agenda
      next()
    })
  }

  /**
   * List
   */

  exports.index = function(req, res) {
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    var perPage = 30
    var options = {
      perPage: perPage,
      page: page
    }

    Agenda.list(options, function(err, agendas) {
      if (err) return res.render('500')
      Agenda.count().exec(function(err, count) {
        res.render('agendas/index', {
          title: 'Agendas',
          agendas: agendas,
          page: page + 1,
          pages: Math.ceil(count / perPage)
        })
      })
    })
  }

  /**
   * New agenda
   */

  exports.new = function(req, res) {
    res.render('agendas/new', {
      title: 'New Agenda',
      agenda: new Agenda({})
    })
  }

  /**
   * Create an agenda
   */

  exports.create = function(req, res) {
    var agenda = new Agenda(req.body)
    agenda.user = req.user

    agenda.uploadAndSave(req.files.image, function(err) {
      if (!err) {
        req.flash('success', 'Successfully created agenda!')
        return res.redirect('/agendas/' + agenda._id)
      }

      res.render('agendas/new', {
        title: 'New Agenda',
        agenda: agenda,
        errors: utils.errors(err.errors || err)
      })
    })
  }

  /**
   * Edit an agenda
   */

  exports.edit = function(req, res) {
    res.render('agendas/edit', {
      title: 'Edit ' + req.agenda.title,
      agenda: req.agenda
    })
  }

  /**
   * Update agenda
   */

  exports.update = function(req, res) {
    var agenda = req.agenda
    agenda = _.extend(agenda, req.body)

    agenda.uploadAndSave(req.files.image, function(err) {
      if (!err) {
        return res.redirect('/agendas/' + agenda._id)
      }

      res.render('agendas/edit', {
        title: 'Edit Agenda',
        agenda: agenda,
        errors: err.errors
      })
    })
  }

  /**
   * Show
   */

  exports.show = function(req, res) {
    res.render('agendas/show', {
      title: req.agenda.title,
      agenda: req.agenda
    })
  }

  /**
   * Delete an agenda
   */

  exports.destroy = function(req, res) {
    var agenda = req.agenda
    agenda.remove(function(err) {
      req.flash('info', 'Deleted successfully')
      res.redirect('/agendas')
    })
  }