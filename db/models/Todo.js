/**
 * Todo Model
 *
 * An instance of a todo item for a user
 *
 * @attribute {String} title header for the todo item
 * @attribute {String} description details about the todo item
 * @attribute {models.User} userId owner's user ID of this todo item
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