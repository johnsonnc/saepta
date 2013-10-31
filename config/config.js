var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  templatePath = path.normalize(__dirname + '/../app/mailer/templates'),
  notifier = {
    service: 'postmark',
    APN: false,
    email: false, // true
    actions: ['comment'],
    tplPath: templatePath,
    key: 'afd5193f-40e3-4000-a44e-d2d249767ac7',
    parseAppId: 'iJW061fcrLEYfNLajI2Irme16TWyZgCfNnwPTZvu',
    parseApiKey: 'F7UJvEg6xJ1iEx7mhbFZRwibFVq6HGDVEJhrfbpa'
  }

module.exports = {
  development: {
    db: 'mongodb://nodejitsu:dfab79f65d227c009135a5c83ca3602b@paulo.mongohq.com:10070/nodejitsudb547154699',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Saepta'
    },
    github: {
      clientID: '8fd0370305d18f1dd1e5',
      clientSecret: '0670f7f36285177f2c4b1650ed83ace77d340b76',
      callbackURL: 'http://saepta.jit.su/auth/github/callback'
    },
    google: {
      clientID: "158395802212.apps.googleusercontent.com",
      clientSecret: "AFWQ_OMjQDPdiOJJ5ZmMJqaU",
      callbackURL: "http://saepta.jit.su/auth/google/callback"
    }
  },
  test: {
    db: 'mongodb://nodejitsu:dfab79f65d227c009135a5c83ca3602b@paulo.mongohq.com:10070/nodejitsudb547154699',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Saepta[Dev]'
    },
    github: {
      clientID: '8fd0370305d18f1dd1e5',
      clientSecret: '0670f7f36285177f2c4b1650ed83ace77d340b76',
      callbackURL: 'http://saepta.jit.su/auth/github/callback'
    },
    google: {
      clientID: "158395802212.apps.googleusercontent.com",
      clientSecret: "AFWQ_OMjQDPdiOJJ5ZmMJqaU",
      callbackURL: "http://saepta.jit.su/auth/google/callback"
    }
  },
  production: {
    db: 'mongodb://nodejitsu:dfab79f65d227c009135a5c83ca3602b@paulo.mongohq.com:10070/nodejitsudb547154699',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Saepta'
    },
    github: {
      clientID: '8fd0370305d18f1dd1e5',
      clientSecret: '0670f7f36285177f2c4b1650ed83ace77d340b76',
      callbackURL: 'http://saepta.jit.su/auth/github/callback'
    },
    google: {
      clientID: "158395802212.apps.googleusercontent.com",
      clientSecret: "AFWQ_OMjQDPdiOJJ5ZmMJqaU",
      callbackURL: "http://saepta.jit.su/auth/google/callback"
    }
  }
}