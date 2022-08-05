const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "not found" });
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

  return response.status(201).send("insert user")
});


app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});



app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
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

  return response.status(201).send();
});



app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title } = request.body;
  const { id } = request.params;
  const { user } = request;

  const index = user.todos.findIndex((user) => user.id === id);
  user.todos[index].title = title;

  return response.json(user.todos[index]);

});



app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});



app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});



module.exports = app;