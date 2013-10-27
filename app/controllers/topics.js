
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Topic = mongoose.model('Topic')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Topic.load(id, function(err, topic) {
    if (err) return next(err)
    if (!topic) return next(new Error('not found'))
    req.topic = topic
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  Topic.list(options, function(err, topics) {
    if (err) return res.render('500')
    Topic.count().exec(function (err, count) {
      res.render('topics/index', {
        title: 'Topics',
        topics: topics,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })  
}

/**
 * New topic
 */

exports.new = function(req, res){
  res.render('topics/new', {
    title: 'New Topic',
    topic: new Topic({})
  })
}

/**
 * Create an topic
 */

exports.create = function (req, res) {
  var topic = new Topic(req.body)
  topic.user = req.user

  topic.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created topic!')
      return res.redirect('/topics/'+topic._id)
    }

    res.render('topics/new', {
      title: 'New Topic',
      topic: topic,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an topic
 */

exports.edit = function (req, res) {
  res.render('topics/edit', {
    title: 'Edit ' + req.topic.title,
    topic: req.topic
  })
}

/**
 * Update topic
 */

exports.update = function(req, res){
  var topic = req.topic
  topic = _.extend(topic, req.body)

  topic.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/topics/' + topic._id)
    }

    res.render('topics/edit', {
      title: 'Edit Topic',
      topic: topic,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('topics/show', {
    title: req.topic.title,
    topic: req.topic
  })
}

/**
 * Delete an topic
 */

exports.destroy = function(req, res){
  var topic = req.topic
  topic.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/topics')
  })
}
