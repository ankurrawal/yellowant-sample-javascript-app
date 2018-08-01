const controller = require('./controllers');
const middlewares = require("./middlewares");

const isLoggedIn = middlewares.isLoggedIn;

module.exports = function (app, passport) {
  app.get('/signup', controller.signup);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }));

  app.get('/signin', controller.signin);
  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin'
  }));

  app.get('/logout', controller.logout);

  app.get('/', isLoggedIn, controller.dashboard);
}