const path = require("path");
const csv = require("csv-parser");
const fs = require("fs");
const insertData = require("../utils/insertData");
const expressAsyncHandler = require('express-async-handler')
const db = require('../utils/database')

const uploadController = expressAsyncHandler(async (req, res) => {
  let results = [];
  const { filename } = req.body;

  fs.createReadStream(path.join(__dirname, "../uploads", filename))
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("error", (err) => {
      console.log("here");
      console.log(err);
    })
    .on("end", async () => {
      results = results.map((entry) => {
        const parsedData = Object.values(entry).filter(
          (value) => value !== null && value !== undefined
        );
        return parsedData;
      });
      if (results.length == 0) {
        console.log("NO valid Rows found");
        return res.status(400).json({
          error: "InvalidEntries",
          message: "Your CSV contains invaild entries",
        });
      }

      insertData(results);

      let query = `SELECT * FROM users limit 20`;
      db.query(query, [], (err, results) => {
        if (err) {
          return res.status(400).json(err)
        }
        results = results.map(e => Object.values(e))


        return res.json({
          rows: results,
          page_no: 1
        })
      })
    });
});

module.exports = uploadController;
