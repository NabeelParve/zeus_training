const multer = require("multer");
const path = require('path')

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null,path.join(__dirname, '../uploads'));
  },
  filename: (req, file, callback) => {
    callback(null, req.body.filename);
  },
});
const uploads = multer({
  storage: Storage,
});

module.exports = uploads;
