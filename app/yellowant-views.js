const uuid = require("uuid/v4");
const sdk = require("yellowant-sdk");

const models = require("../db/models");
let {
  YellowAntIntegration,
  YellowAntRedirectState,
  User
} = models;

/**
 * Initiate the creation of a new user integration on YA
 *
 * YA uses oauth2 as its authorization framework. This method requests for an
 * oauth2 code from YAto start creating a new user integration for this application on YA.
 */
module.exports.requestYellowAntOAuthCode = async function (req, res) {
  // get the user requesting to create a new YA integration
  const user = req.user;
  // generate a unique ID to identify the user when YA returns an oauth2 code
  const state = uuid();

  // save the relation between user and state so that we can identify the user
  // when YA returns the oauth2 code
  await YellowAntRedirectState.create({ UserId: user.id, state });

  // Redirect the application user to the YA authentication page. Note that we
  // are passing state, this app's client id, oauth response type as code, and
  // the url to return the oauth2 code at.
  res.redirect(`${process.env.YA_OAUTH_URL}?state=${state}&client_id=${process.env.YA_CLIENT_ID}&response_type=code&redirect_url=${process.env.YA_REDIRECT_URL}`);
}


/**
 * Receive the oauth2 code from YA to generate a new user integration
 *
 * This method calls utilizes the YA Python SDK to create a new user integration
 * on YA. This method only provides the code for creating a new user integration
 * on YA. Beyond that, you might need to authenticate the user on the actual
 * application (whose APIs this application will be calling) and store a
 * relation between these user auth details and the YA user integration.
 */
module.exports.yellowantOAuthRedirect = async function (req, res) {
  // oauth2 code from YA, passed as GET params in the url
  const code = req.query.code;
  // the unique string to identify the user for which we will create an integration
  const state = req.query.state;

  // fetch user with the help of state
  const yellowantRedirectState = await YellowAntRedirectState.findOne({ where: { state }});
  const user = await User.findById(yellowantRedirectState.UserId);

  // init yellowant SDK client
  const YellowAnt = sdk.Yellowant;
  const client = new YellowAnt({
    appKey: process.env.YA_CLIENT_ID, // App client ID from the YellowAnt Developer Console
    appSecret: process.env.YA_CLIENT_SECRET, // App client secret from the YellowAnt Developer Console
    redirectUri: process.env.YA_REDIRECT_URL, // App redirect URI set in the app settings page in the YellowAnt Developer Console
  });
  // Generate an access token for the user from the OAuth code
  await client.getAccessToken(code); // This access token value is saved inside the client instance automatically

  // Connect the user's app account with an integration on the YellowAnt platform
  const yellowantIntegration = await client.createUserIntegration();

  // Get user profile details
  const yellowantUser = await client.getUserProfile();

  // save details to db
  await YellowAntIntegration.create({
    UserId: user.id,
    yellowantUserId: yellowantUser.id,
    yellowantTeamSubdomain: yellowantUser.team.domain_name,
    yellowantIntegrationId: yellowantIntegration.user_application,
    yellowantIntegrationInvokeName: yellowantIntegration.user_invoke_name,
    yellowantIntegrationToken: client.accessToken
  });

  // A new YA user integration has been created and the details have been successfully saved in
  // your application's database. However, we have only created an integration on YA. As a
  // developer, you need to begin an authentication process for the actual application, whose API
  // this application is connecting to. Once, the authentication process for the actual application
  // is completed with the user, you need to create a db entry which relates the YA user
  // integration, we just created, with the actual application authentication details of the user.
  // This application will then be able to identify the actual application accounts corresponding
  // to each YA user integration.
  res.redirect("/");
}

/**
 * Receive user commands from YA
 */
module.exports.yellowantAPI = async function (req, res) {

}