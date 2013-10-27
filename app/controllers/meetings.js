/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Meeting = mongoose.model('Meeting'),
  utils = require('../../lib/utils'),
  _ = require('underscore')

  /**
   * Load
   */

  exports.load = function(req, res, next, id) {
    var User = mongoose.model('User')

    Meeting.load(id, function(err, meeting) {
      if (err) return next(err)
      if (!meeting) return next(new Error('not found'))
      req.meeting = meeting
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

    Meeting.list(options, function(err, meetings) {
      if (err) return res.render('500')
      Meeting.count().exec(function(err, count) {
        res.render('meetings/index', {
          title: 'Meetings',
          meetings: meetings,
          page: page + 1,
          pages: Math.ceil(count / perPage)
        })
      })
    })
  }

  /**
   * New meeting
   */

  exports.new = function(req, res) {
    res.render('meetings/new', {
      title: 'New Meeting',
      meeting: new Meeting({})
    })
  }

  /**
   * Create an meeting
   */

  exports.create = function(req, res) {
    var meeting = new Meeting(req.body)
    meeting.user = req.user

    meeting.uploadAndSave(req.files.image, function(err) {
      if (!err) {
        req.flash('success', 'Successfully created meeting!')
        return res.redirect('/meetings/' + meeting._id)
      }

      res.render('meetings/new', {
        title: 'New Meeting',
        meeting: meeting,
        errors: utils.errors(err.errors || err)
      })
    })
  }

  /**
   * Edit an meeting
   */

  exports.edit = function(req, res) {
    res.render('meetings/edit', {
      title: 'Edit ' + req.meeting.title,
      meeting: req.meeting
    })
  }

  /**
   * Update meeting
   */

  exports.update = function(req, res) {
    var meeting = req.meeting
    meeting = _.extend(meeting, req.body)

    meeting.uploadAndSave(req.files.image, function(err) {
      if (!err) {
        return res.redirect('/meetings/' + meeting._id)
      }

      res.render('meetings/edit', {
        title: 'Edit Meeting',
        meeting: meeting,
        errors: err.errors
      })
    })
  }

  /**
   * Show
   */

  exports.show = function(req, res) {
    res.render('meetings/show', {
      title: req.meeting.title,
      meeting: req.meeting
    })
  }

  /**
   * Delete an meeting
   */

  exports.destroy = function(req, res) {
    var meeting = req.meeting
    meeting.remove(function(err) {
      req.flash('info', 'Deleted successfully')
      res.redirect('/meetings')
    })
  }