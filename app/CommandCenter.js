/** Command Center which handles the user command and produces the appropriate message */
const sdk = require("yellowant-sdk");
const Message = sdk.Message;
const MessageAttachment = sdk.MessageAttachment;
const MessageAttachmentField = sdk.MessageAttachmentField;

const models = require("../db/models");
let {
  Todo,
  YellowAntIntegration
} = models;


/**
 * createMessage
 *
 * Handles user commands
 *
 * @arg {Number} yellowantIntegrationId ID of the integration from which the command is invoked
 * @arg {String} commandName command name
 * @arg {Object} args any arguments supplementing the command
 */
async function createMessage(yellowantIntegrationId, commandName, args) {
  // check whether yellowant integration exists
  const yellowantIntegration = await YellowAntIntegration.findOne({ where: { yellowantIntegrationId } });
  if (yellowantIntegration == null) {
    return new Message("Integration does not exist");
  }

  // check whether the command name is supported
  if (commandsByInvokeName[commandName] == null) {
    return new Message("Command does not exist, or is disabled.");
  }

  return await commandsByInvokeName[commandName](args, yellowantIntegration);
}

const commandsByInvokeName = {
  "createitem": createItem,
  "getlist": getList,
  "getitem": getItem,
  "updateitem": updateItem,
  "deleteitem": deleteItem,
}

async function createItem(args, yellowantIntegration) {
  let message = new Message();

  let todo = await Todo.create({
    YellowAntIntegrationId: yellowantIntegration.UserId,
    title: args.title,
    description: args.description,
  });

  message.text = "Created todo item:";

  message.addAttachment(buildTodoAttachment(todo));

  return message;
}

async function getList(args, yellowantIntegration) {
  let message = new Message();

  let todoList = await Todo.findAll({ where: { YellowAntIntegrationId: yellowantIntegration.id } });

  message.text = "Here are your todo items:";
  for (let todo of todoList) {
    message.addAttachment(buildTodoAttachment(todo));
  }

  return message;
}

async function getItem(args, yellowantIntegration) {
  let message = new Message();

  let todo = await Todo.findOne({ where: { id: args.id, YellowAntIntegrationId: yellowantIntegration.id } });

  if (todo == null) {
    message.text = "Could not find the todo item."
  } else {
    message.text = "Here is your todo item:";
    message.addAttachment(buildTodoAttachment(todo));
  }

  return message;
}

async function updateItem(args, yellowantIntegration) {
  let message = new Message();

  let todo = await Todo.findOne({ where: { id: args.id, YellowAntIntegrationId: yellowantIntegration.id } });

  if (todo == null) {
    message.text = "Could not find the todo item to update."
  } else {
    let title = args.title || todo.title;
    let description = args.description || todo.description;

    await todo.update({ title, description });

    message.text = "Here is your updated todo item:";
    message.addAttachment(buildTodoAttachment(todo));
  }

  return message;
}

async function deleteItem(args, yellowantIntegration) {
  let message = new Message();

  let todo = await Todo.findOne({ where: { id: args.id, YellowAntIntegrationId: yellowantIntegration.id } });

  if (todo == null) {
    message.text = "Could not find the todo item to delete."
  } else {
    await todo.destroy({ force: true });

    let todoList = await Todo.findAll({ where: { YellowAntIntegrationId: yellowantIntegration.id } });

    message.text = "Deleted item. Here are your remaining todo items:";
    for (let todo of todoList) {
      message.addAttachment(buildTodoAttachment(todo));
    }
  }

  return message;
}


function buildTodoAttachment(todo) {
  let attachment = new MessageAttachment({
    title: todo.title,
    text: todo.description
  });

  let field = new MessageAttachmentField({
    title: "ID",
    value: todo.id
  });

  attachment.addField(field);

  return attachment;
}

module.exports = createMessage;