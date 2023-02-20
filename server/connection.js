const { response } = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Foodie@123",
  database: "api",
});

const processErrorMessage = (err, message) => {
  let errorStackResponse = err.stack.split("\n")[0];
  let errorMessage = errorStackResponse ? errorStackResponse : message;
  return errorMessage;
};

const runQuery = (pool, response) => {
  pool
    .query(`SELECT *,pg_sleep(0.1) from users`)
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
    if (abortQuery === true) {
      clearInterval(abortQueryCheck);
      pool
        .query(`SELECT pg_cancel_backend($1)`, [pid])
        .then((res) => {
          response.status(200).send("Query Aborted Successfully");
        })
        .catch((err) => {
          response
            .status(501)
            .json(
              processErrorMessage(err, "Query Abort could not be processed")
            );
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
        response.status(501).json(processErrorMessage(err, "Query Failed"));
      });
  } catch {
    response.status(501).json("Error Retrieving Data");
  }
};

module.exports = {
  getUsers,
};
