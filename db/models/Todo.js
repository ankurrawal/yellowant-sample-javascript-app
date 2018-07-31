/**
 * Todo Model
 *
 * An instance of a todo item for a user
 *
 * @arg {models.User} UserId owner's user ID of this todo item
 * @arg {String} title header for the todo item
 * @arg {String} description details about the todo item
 */
module.exports = function(sequelize, Sequelize) {
  const Todo = sequelize.define("Todo", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
    }
  });
  Todo.associate = function(models) {
    Todo.belongsTo(models.User, { onDelete: "CASCADE" });
  };

  return Todo;
};