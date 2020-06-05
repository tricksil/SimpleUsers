const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Routes params = /users/1
// Request body = {  }

const users = ["Patrick", "Naelio", "Bruno"];

// Exemple of middleware
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

// Required name of camp name
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

// checkin if user exists
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does is exists" });
  }

  req.user = user;

  return next();
}

// get all users
server.get("/users", (req, res) => {
  return res.json(users);
});


// search user by id
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// add user
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// update user
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// delete user
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
