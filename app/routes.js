var controller = require('./controllers');

module.exports = function (app, passport) {
  app.get('/signup', controller.signup);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  }));

  app.get('/signin', controller.signin);
  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin'
  }));

  app.get('/logout', controller.logout);

  app.get('/dashboard', isLoggedIn, controller.dashboard);

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/signin');
  }
}