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
 * Company Schema
 */

var CompanySchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  tags: {
    type: [],
    get: getTags,
    set: setTags
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

/**
 * Validations
 */

CompanySchema.path('name').validate(function(name) {
  return name.length > 0
}, 'Company name cannot be blank')
/*
CompanySchema.path('body').validate(function(body) {
  return body.length > 0
}, 'Company body cannot be blank')
*/
/**
 * Pre-remove hook
 */

CompanySchema.pre('remove', function(next) {
  /*  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function(err) {
    if (err) return next(err)
  }, 'company')
*/
  next()
})

/**
 * Methods
 */

CompanySchema.methods = {

  /**
   * Save company and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function(images, cb) {
    this.save(cb)

  }

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  /*  addComment: function(user, comment, cb) {
    var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    notify.comment({
      company: this,
      currentUser: user,
      comment: comment.body
    })

    this.save(cb)
  }
*/
}

/**
 * Statics
 */

CompanySchema.statics = {

  /**
   * Find company by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function(companyId, cb) {
    this.findOne({
      _id: companyId
    })
      .populate('creator', 'name email id') // may need to adjust for _id
    .populate('members', 'name email id')
      .exec(cb)
  },

  /**
   * List companys
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function(options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('creator', 'name email id')
      .sort({
        'createdAt': -1
      }) // sort by date
    .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Company', CompanySchema)