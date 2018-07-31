/**
 * User Model
 *
 * Store the authentication credentials for the Todo Application
 *
 * @arg {String} username login for the user
 * @arg {String} password password for the user
 *
 */
module.exports = function(sequelize, Sequelize) {
  const User = sequelize.define("User", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return User;
};