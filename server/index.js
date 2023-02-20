const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ message: "NodeJS Express Postgres API " });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
