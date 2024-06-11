const db = require("./database");

const insertIntoSQL = (data) => {
  let query = `INSERT INTO users 
        (name, email, age, address) VALUES ?;`;

  // Executing the query
  db.query(query, [data], (err, rows) => {
    if (err) {
      if (err?.code === "ER_DUP_ENTRY") {
        console.error("Duplicate entry detected");
      } else {
        console.log("QueryError");
        console.log(err);
      }
    } else {
      console.log("All rows inserted");
    }
  });
};

module.exports = insertIntoSQL;
