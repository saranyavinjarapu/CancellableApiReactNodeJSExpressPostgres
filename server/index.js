const express = require("express");
const bodyParser = require("body-parser");
const db = require("./connection");
const app = express();
const port = 5002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ message: "NodeJS Express Postgres API " });
});

app.get("/users", db.getUsers);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
