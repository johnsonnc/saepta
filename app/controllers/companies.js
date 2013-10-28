/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  User = mongoose.model('User'),
  utils = require('../../lib/utils'),
  _ = require('underscore')

  /**
   * Load
   */

  exports.load = function(req, res, next, id) {
    var User = mongoose.model('User')

    Company.load(id, function(err, company) {
      if (err) return next(err)
      if (!company) return next(new Error('not found'))
      req.company = company
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

    Company.list(options, function(err, companies) {
      if (err) return res.render('500')
      Company.count().exec(function(err, count) {
        res.render('companies/index', {
          title: 'Companies',
          companies: companies,
          page: page + 1,
          pages: Math.ceil(count / perPage)
        })
      })
    })
  }

  /**
   * New company
   */

  exports.new = function(req, res) {
    res.render('companies/new', {
      title: 'New Company',
      company: new Company({})
    })
  }

  /**
   * Create an company
   */

  exports.create = function(req, res) {
    var company = new Company(req.body)
    company.creator = req.user

    company.uploadAndSave(req.files.image, function(err) {
      if (!err) {
        req.flash('success', 'Successfully created company!')
        return res.redirect('/companies/' + company._id)
      }

      res.render('companies/new', {
        title: 'New Company',
        company: company,
        errors: utils.errors(err.errors || err)
      })
    })
  }

  /**
   * Edit an company
   */

  exports.edit = function(req, res) {
    res.render('companies/edit', {
      title: 'Edit ' + req.company.title,
      company: req.company
    })
  }

  /**
   * Update company
   */

  exports.update = function(req, res) {
    var company = req.company
    company = _.extend(company, req.body)

    company.uploadAndSave(req.files.image, function(err) {
      if (!err) {
        return res.redirect('/companies/' + company._id)
      }

      res.render('companies/edit', {
        title: 'Edit Company',
        company: company,
        errors: err.errors
      })
    })
  }

  /**
   * Show
   */

  exports.show = function(req, res) {

    var User = mongoose.model('User')
    res.render('companies/show', {
      title: req.company.title,
      company: req.company
    })


  }

  /**
   * Delete an company
   */

  exports.destroy = function(req, res) {
    var company = req.company
    company.remove(function(err) {
      req.flash('info', 'Deleted successfully')
      res.redirect('/companies')
    })
  }


exports.search = function(req, res) {
  var regex = new RegExp(req.query["term"], 'i');
  var query = Company.find({
    name: regex
  }, {
    'name': 1
  }).sort({
    "updated_at": -1
  }).sort({
    "created_at": -1
  }).limit(20);

  // Execute query in a callback and return users list
  query.exec(function(err, companies) {
    if (!err) {
      // Method to construct the json result set
      //var result = buildResultSet(companies);
      var result = function(companies) {
        var r = [];
        for (var i = 0; i < companies.length; i = i + 1) {
          r.push({
            name: companies[0].name,
            _id: companies[0]._id
          })
        }
        return r; // may need to string.
      }


      res.send(result(companies), {
        'Content-Type': 'application/json'
      }, 200);
    } else {
      res.send(JSON.stringify(err), {
        'Content-Type': 'application/json'
      }, 404);
    }

  });

}