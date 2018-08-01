const models = require("../db/models");
let {
  YellowAntIntegration
} = models;

var exports = module.exports = {}

exports.signup = function(req, res) {
  res.render('signup');
}

exports.signin = function(req, res) {
  res.render('signin');
}

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
      res.redirect('/');
  });
}

exports.dashboard = async function(req, res) {
  const userIntegrations = await YellowAntIntegration.findAll({where: {UserId: req.user.id }});
  res.render('dashboard', {
    userIntegrations
  });
}