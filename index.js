const express = require("express");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const env = require("dotenv").load();
const exphbs = require("express-handlebars");
const SQLiteStore = require('connect-sqlite3')(session);

const middlewares = require("./app/middlewares");
const yellowantViews = require("./app/yellowant-views");

const app = express();

// For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({
  store: new SQLiteStore,
  secret: '1357e0bc-46c6-413b-b30b-3f487de1d16b',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// For Handlebars
app.set("views", "./app/templates")
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//Models
var models = require("./db/models");

//Routes
var routes = require('./app/routes')(app, passport);

// passport strategies
require("./app/config/passport")(passport, models.User);

//Sync Database
models.sequelize.sync()
  .then(function() { console.log("Connection to database established successfully."); })
  .catch(function(err) { console.log(err, "Something went wrong with the Database Update!"); });

/** VIEWS */
app.get("/create-new-integration", middlewares.isLoggedIn, yellowantViews.requestYellowAntOAuthCode);
app.get("/yellowant-oauth-redirect", middlewares.isLoggedIn, yellowantViews.yellowantOAuthRedirect);

const PORT = 4000;
app.listen(PORT, () => { console.log(`Listening on localhost:${PORT}`); });