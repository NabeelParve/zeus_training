const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./utils/database");
const routes = require("./routes");
const multer = require("multer");

app.use(cors());

db.connect((err) => {
  if (err) {
    console.log("failed to connect to the MySQL server");
    console.log(err);
  } else {
    console.log("Connected to the Database");
  }
});

app.use(express.json());

app.get("/ping", (req, res) => {
  res.end(200, "PONG!");
});

app.use("/", routes);

app.use((err, req, res, next) => {
  console.log("debug");
  console.error(err);
  if (err) {
    return res.status(400).json(err);
  } else res.status(500).json({ error: "Internal Server Error" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is up and running!");
});
