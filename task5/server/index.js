const app = require("express")();
const cors = require("cors");
require("dotenv").config();
const db = require("./utils/database");
const routes = require('./routes')


app.use(cors());


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

app.use('/' , routes)


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is up and running!");
});
