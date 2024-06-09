const app = require("express")();
const cors = require("cors");
require("dotenv").config();
const db = require("./utils/database");
const multer = require("multer");
const { response } = require("express");

app.use(cors());
const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + "/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const uploads = multer({
  storage: Storage,
});

db.connect((err) => {
  if (err) {
    console.log("failed to connect to the MySQL server");
    console.log(err);
  } else {
    console.log("Connected to the Database");
  }
});

app.get("/ping", (req, res) => {
  res.send(200, "PONG!");
});

app.post("/upload", uploads.single("file"), async (req, res) => {
  console.log(req.file);
  console.log("Endpoint is hitted");
  res.json({
    data: "Working",
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is up and running!");
});
