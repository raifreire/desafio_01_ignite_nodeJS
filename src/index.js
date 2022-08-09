const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { username, name } = request.body;

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "data alreadey exists in database" })
  }

  users.push({
    username,
    name,
    id: uuidv4(),
    todos: []
  });

  return response.status(201).send("insert user in data base");
});


app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});



app.post("/todos", checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;

  const { user } = request;

  const sendtodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(sendtodo);

  return response.status(201).json(sendtodo);
});



app.put("/todos/:id", checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const index = user.todos.findIndex((user) => user.id === id);

  user.todos[index].title = title;
  user.todos[index].deadline = deadline;

  return response.json(user.todos[index]);

});


app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { id } = request.params;
  const { user } = request;

  const index = user.todos.findIndex((user) => user.id === id);

  if (index === -1) {
    return response.status(404).json({ error: "todo not exists" });
  };

  user.todos[index].done = true;

  return response.json(user.todos);
});


app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const index = user.todos.findIndex((user) => user.id === id);

  if (index === -1) {
    return response.status(404).json({ error: "todo not exists" });
  };

  user.todos.splice(index, 1);

  return response.status(204).json();
});



module.exports = app;