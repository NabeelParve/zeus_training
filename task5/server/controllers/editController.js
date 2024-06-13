const expressAsyncHandler = require("express-async-handler");
const db = require("../utils/database");

const deleteController = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  let query = `SELECT * FROM users WHERE email='${email}'`;
  db.query(query, [], (err, result) => {
    if (result.length == 0) {
      return res.status(400).json({
        message: "No entry found",
      });
    }
    query = `DELETE FROM users WHERE email='${email}'`;
    db.query(query, [], (err, result) => {
      if (err) {
        throw Error(err);
      }

      return res.status(200).jsonp({
        message: "successfully deleted",
      });
    });
  });
});


const insertController =expressAsyncHandler((req, res)=>{
    const {name , email , age, address} = req.body;

    console.log(req.body)

    let query = `INSERT INTO users 
        (name, email, age, address) VALUES (?,?,?,?) 
        ON DUPLICATE KEY UPDATE 
        name=VALUES(name), email=VALUES(email), age=VALUES(age), address=VALUES(address);`

        db.query(query , [name,email,age,address],(err , res)=>{
            if(err){
                throw err
            }
        })

        return res.status(201).json({
            message : "Updated Succesfully!"
        })
})

module.exports = { deleteController, insertController };
