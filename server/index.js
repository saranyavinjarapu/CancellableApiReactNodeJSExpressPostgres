const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server: server });
const port = 5002;
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Foodie@123",
  database: "api",
});

let isAbortQuery = false;

wss.on("connection", function connection(ws) {
  ws.send("Welcome New Client!");

  ws.on("message", function incoming(message) {
    if (message == "Abort") {
      isAbortQuery = true;
    }
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const processErrorMessage = (err, message) => {
  let errorStackResponse = err.stack.split("\n")[0];
  let errorMessage = errorStackResponse ? errorStackResponse : message;
  return errorMessage;
};

const runQuery = (pool, response) => {
  pool
    .query(`SELECT *,pg_sleep(1) from users`)
    .then((result) => {
      response.status(200).send(result.rows);
    })
    .catch((err) => {
      response
        .status(501)
        .json(processErrorMessage(err, "Data Query could not be processed"));
    });
};

const abortQuery = (pool, pid, response) => {
  var abortQueryCheck = setInterval(() => {
    if (isAbortQuery === true) {
      isAbortQuery = false;
      clearInterval(abortQueryCheck);
      pool
        .query(`SELECT pg_cancel_backend($1)`, [pid])
        .then((res) => {
          console.log("Query Aborted Successfully");
        })
        .catch((err) => {
          console.log("Query Could not Aborted Successfully");
        });
    }
  }, 50);
};

const getUsers = async (request, response) => {
  try {
    await pool
      .query("SELECT pg_backend_pid()")
      .then((res) => {
        let pid = res.rows[0].pg_backend_pid;
        runQuery(pool, response);
        abortQuery(pool, pid, response);
      })
      .catch((err) => {
        response.status(501).send(processErrorMessage(err, "Query Failed"));
      });
  } catch {
    response.status(501).send("Error Retrieving Data");
  }
};

app.get("/", (request, response) => {
  response.json({ message: "NodeJS Express Postgres API " });
});

app.get("/users", getUsers);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
