const path = require("path");
const csv = require("csv-parser");
const fs = require("fs");
const insertData = require("../utils/insertData");
const asyncHandler = require("express-async-handler");

const uploadController = asyncHandler(async (req, res) => {
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
    
      return res.status(201).json({
        data: results.slice(0, 20),
      });
    });
});

module.exports = uploadController;
