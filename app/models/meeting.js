/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Imager = require('imager'),
  env = process.env.NODE_ENV || 'development',
  config = require('../../config/config')[env],
  imagerConfig = require(config.root + '/config/imager.js'),
  Schema = mongoose.Schema

  /**
   * Getters
   */

var getTags = function(tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function(tags) {
  return tags.split(',')
}

/**
 * Meeting Schema
 */

var MeetingSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true
  },
  details: {
    type: String,
    default: '',
    trim: true
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },

  comments: [{
    body: {
      type: String,
      default: ''
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: {
    type: [],
    get: getTags,
    set: setTags
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  invities: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  confirmed: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
})

/**
 * Validations
 */

MeetingSchema.path('title').validate(function(title) {
  return title.length > 0
}, 'Meeting title cannot be blank')

MeetingSchema.path('details').validate(function(details) {
  return details.length > 0
}, 'Meeting details cannot be blank')

/**
 * Pre-remove hook
 */

MeetingSchema.pre('remove', function(next) {
  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function(err) {
    if (err) return next(err)
  }, 'meeting')

  next()
})

/**
 * Methods
 */

MeetingSchema.methods = {

  /**
   * Save meeting and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function(images, cb) {
    this.save(cb)

  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function(user, comment, cb) {
    var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    notify.comment({
      meeting: this,
      currentUser: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

MeetingSchema.statics = {

  /**
   * Find meeting by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function(id, cb) {
    this.findOne({
      _id: id
    })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List meetings
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function(options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({
        'createdAt': -1
      }) // sort by date
    .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Meeting', MeetingSchema)