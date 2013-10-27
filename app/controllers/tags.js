/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Topic = mongoose.model('Topic')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Topic.list(options, function(err, topics) {
    if (err) return res.render('500')
    Topic.count(criteria).exec(function (err, count) {
      res.render('topics/index', {
        title: 'Topics tagged ' + req.param('tag'),
        topics: topics,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}
