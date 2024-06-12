const multer = require("multer");
const path = require("path");

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, req.body.filename);
  },
});
const fileFilterConfig = function (req, file, cb) {
  if (file.mimetype === "text/csv") {
    // calling callback with true
    // as mimetype of file is image
    cb(null, true);
  } else {
    // false to indicate not to store the file
    cb(
      {
        error: "InvalidFile",
        message: "File type uploaded is not a csv file",
      },
      false
    );
  }
};
const uploads = multer({
  // applying storage and file filter
  storage: Storage,
  limits: {
    // limits file size to 5 MB
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilterConfig,
});
module.exports = uploads;
