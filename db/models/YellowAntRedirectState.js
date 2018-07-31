/**
 * YellowAnt Redirect State Model
 *
 * Create a new entry between the user and the oauth state
 *
 * @arg {models.User} UserId owner's user ID associated with the redirect state
 * @arg {String} state A unique ID which helps in matching an oauth2 code from
 * YA to a user
 */
module.exports = function(sequelize, Sequelize) {
  const YellowAntRedirectState = sequelize.define("YellowAntRedirectState", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  YellowAntRedirectState.associate = function(models) {
    YellowAntRedirectState.belongsTo(models.User, { onDelete: "CASCADE" });
  };

  return YellowAntRedirectState;
};