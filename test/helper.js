/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  async = require('async'),
  Agenda = mongoose.model('Agenda'),
  Company = mongoose.model('Company'),
  Topic = mongoose.model('Topic'),
  Meeting = mongoose.model('Meeting'),
  User = mongoose.model('User')

  /**
   * Clear database
   *
   * @param {Function} done
   * @api public
   */

  exports.clearDb = function(done) {
    async.parallel([
      function(cb) {
        User.collection.remove(cb)
      },
      function(cb) {
        Article.collection.remove(cb)
      }
    ], done)
  }