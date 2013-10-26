'use strict';

/*
 * Express Dependencies
 */
var config = require('./lib/config.js');
var data = require('./lib/data.js');
var https = require('https');
var http = require('http');
var connect = require('connect');
var express = require('express');
var everyauth = require('everyauth');
var app = express();
var port = 3000;


/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');

var RedisStore = require('connect-redis')(express);

var sesh = new RedisStore();
var hbs;

function usersByLogin(login, userData) {
    if (!userData) {
        if (client.hget("USERS", login)) {
            return client.hget("USERS", login)
        }
    } else {
        var put = {};
        put[login] = userData;
        client.hset("USERS", put);
        return userData;
    }
}

everyauth
    .password
    .loginWith('login')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login')
    .loginLocals(function(req, res, done) {
        setTimeout(function() {
            done(null, {
                title: 'Async login'
            });
        }, 200);
    })
    .authenticate(function(login, password) {
        var errors = [];
        if (!login) errors.push('Missing login');
        if (!password) errors.push('Missing password');
        if (errors.length) return errors;

        var user = usersByLogin(login);

        if (!user) return ['Login failed'];
        if (user.password !== password) return ['Login failed'];
        return user;
    })
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register')
    .registerLocals(function(req, res, done) {
        setTimeout(function() {
            done(null, {
                title: 'Async Register'
            });
        }, 200);
    })
    .extractExtraRegistrationParams(function(req) {
        return {
            email: req.body.email,
            company: req.body.email
        };
    })
    .validateRegistration(function(newUserAttrs, errors) {
        var login = newUserAttrs.login;
        if (usersByLogin[login]) errors.push('Login already taken');
        return errors;
    })
    .registerUser(function(newUserAttrs) {
        var login = newUserAttrs[this.loginKey()];
        return usersByLogin[login] = newUserAttrs;
    })
    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');

// For gzip compression
app.configure(function() {
    app.use(express.compress());
    app.use(express.cookieParser());
    app.use(express.session({
        store: sesh,
        secret: config.redis_secret
    }));
    app.use(everyauth.middleware());


});
/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');

    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');

    // Locate the assets
    app.use(express.static(__dirname + '/assets'));
}

// Set Handlebars
app.set('view engine', 'handlebars');


everyauth.everymodule.handleLogout(function(req, res) {
    req.logout();
    req.session.guid = null;
    res.writeHead(303, {
        'Location': this.logoutRedirectPath()
    });
    res.end();
});


app.get('/', function(req, res) {
    if (req.session && req.session.guid) {
        return res.redirect('/board');
    }
    res.render('index');
});


app.get('/users/', function(request, response, next) {

});

hbs = exphbs.create({
    helpers: {
        'topics': function() {
            var out = "<ul>";
            for (var i = 0, l = topics.length; i < l; i++) {
                out = out + "<li>" + options.fn(topics[i]) + "</li>";
            }

            return out + "</ul>";
        }
    }

});


/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);