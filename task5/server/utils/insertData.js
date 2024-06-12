const db = require("./database");

const insertIntoSQL = (data) => {
  let query = `INSERT INTO users 
        (name, email, age, address) VALUES ? 
        ON DUPLICATE KEY UPDATE 
        name=VALUES(name), email=VALUES(email), age=VALUES(age), address=VALUES(address);`;

  // Executing the query
  db.query(query, [data], (err, rows) => {
    if (err) {
        console.log('QueryError')
        throw Error({
          error : 'QueryError',
          message : 'Internal server Error'
        })
      
    } else {
      console.log("All rows inserted");
    }
  });
};

module.exports = insertIntoSQL;
