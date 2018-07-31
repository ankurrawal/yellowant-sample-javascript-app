/**
 * YellowAnt Integration Model
 *
 * Holds the information which identifies your user with an integration on YA.
 *
 * Since a single YA user is allowed to have multiple integrations with your
 * application on YA, you need to store a one-to-many relationship for a user to
 * many YA user integrations.
 *
 * For example, if this is a mail application, users might want to connect their
 * personal mail and work mail with YA. In this case, a single user will have
 * two YA integrations, one which connects the personal mail, and the other
 * which connects the work mail.
 *
 * @arg {models.User} UserId owner's user ID of this YellowAnt Integration
 * @arg {Number} yellowantUserId YA user id
 * @arg {String} yellowantTeamSubdomain YA user's team subdomain. Each user on
 * YA belongs to a team, irrespective of the team size
 * @arg {Number} yellowantIntegrationId Unique YA user integration id
 * @arg {String} yellowantIntegrationInvokeName YA integration invoke name. Each
 * integration of your application is controlled by the user with the help of
 * your application's default invoke name. Since a YA user is allowed to have
 * multiple integrations with your application, YA will suffix the default
 * invoke name for users who want to integrate more than once with your
 * application, so that they can control the different integrations with their
 * respective invoke names.
 * @arg {String} yellowantIntegrationToken Unique token per integration. This
 * token allows your application to perform actions on the YA platform for the
 * YA user integration.
 */
module.exports = function(sequelize, Sequelize) {
  const YellowAntIntegration = sequelize.define("YellowAntIntegration", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    yellowantUserId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    yellowantTeamSubdomain: {
      type: Sequelize.STRING,
      allowNull: false
    },
    yellowantIntegrationId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    yellowantIntegrationInvokeName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    yellowantIntegrationToken: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  YellowAntIntegration.associate = function(models) {
    YellowAntIntegration.belongsTo(models.User, { onDelete: "CASCADE" });
  };

  return YellowAntIntegration;
};