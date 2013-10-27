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
 * Topic Schema
 */

var TopicSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true
  },
  body: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  company: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  approved: {
    type: Boolean,
    default: false
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
  priority: {
    type: String,
    default: '0'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  votesUp: {
    type: Number,
    default: "0"
  },
  votesDown: {
    type: Number,
    default: "0"
  },
})

/**
 * Validations
 */

TopicSchema.path('title').validate(function(title) {
  return title.length > 0
}, 'Topic title cannot be blank')

TopicSchema.path('body').validate(function(body) {
  return body.length > 0
}, 'Topic body cannot be blank')

/**
 * Pre-remove hook
 */

TopicSchema.pre('remove', function(next) {
  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function(err) {
    if (err) return next(err)
  }, 'topic')

  next()
})

/**
 * Methods
 */

TopicSchema.methods = {

  /**
   * Save topic and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function(images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3')
    var self = this

    imager.upload(images, function(err, cdnUri, files) {
      if (err) return cb(err)
      if (files.length) {
        self.image = {
          cdnUri: cdnUri,
          files: files
        }
      }
      self.save(cb)
    }, 'topic')
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
      topic: this,
      currentUser: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

TopicSchema.statics = {

  /**
   * Find topic by id
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
   * List topics
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

mongoose.model('Topic', TopicSchema)