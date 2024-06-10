const path = require('path')
const csv = require("csv-parser");
const fs = require("fs");
const insertData = require('../utils/insertData')



const uploadController = async (req, res) => {
    const results = [];
    const { filename } = req.body;
  
    fs.createReadStream(path.join(__dirname, '../uploads', filename))
      .pipe(csv())
      .on("data", (data) => {
        results.push(data)
      })
      .on('error' , (err)=>{
        console.log("here")
        console.log(err)
      })
      .on("end", () => {
        insertData(results).then(()=>console.log("hello"));
        return res.json({
          data: results.slice(0,10)
        });
      });
  
    
  }


  module.exports = uploadController