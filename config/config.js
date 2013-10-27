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
    db: 'mongodb://localhost/db',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Saepta'
    },
    github: {
      clientID: '8fd0370305d18f1dd1e5',
      clientSecret: '0670f7f36285177f2c4b1650ed83ace77d340b76',
      callbackURL: 'http://local.host:3000/auth/github/callback'
    },
    google: {
      clientID: "158395802212.apps.googleusercontent.com",
      clientSecret: "AFWQ_OMjQDPdiOJJ5ZmMJqaU",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  test: {
    db: 'mongodb://localhost/dbtest',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Saepta[Dev]'
    },
    github: {
      clientID: '8fd0370305d18f1dd1e5',
      clientSecret: '0670f7f36285177f2c4b1650ed83ace77d340b76',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "158395802212.apps.googleusercontent.com",
      clientSecret: "AFWQ_OMjQDPdiOJJ5ZmMJqaU",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  production: {
    db: 'mongodb://localhost/db',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Saepta'
    },
    github: {
      clientID: '8fd0370305d18f1dd1e5',
      clientSecret: '0670f7f36285177f2c4b1650ed83ace77d340b76',
      callbackURL: 'http://saetpaapp.com/auth/github/callback'
    },
    google: {
      clientID: "158395802212.apps.googleusercontent.com",
      clientSecret: "AFWQ_OMjQDPdiOJJ5ZmMJqaU",
      callbackURL: "http://saetpaapp.com/auth/google/callback"
    }
  }
}