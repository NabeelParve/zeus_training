// const insertIntoSQL = async ()=>{


// }
// const path = require('path')
// const csv = require("csv-parser");
// const fs = require("fs");


// const uploadMiddleware = (req,res,next)=>{
//     const results = [];
//     const { filename } = req.body;
//     console.log(filename)
  
//     fs.createReadStream(path.join(__dirname, '../uploads', filename))
//       .pipe(csv())
//       .on("data", (data) => {
//         if(results.length == 10)
//         req.data = results
//         results.push(data)
//       })
//       .on('error' , (err)=>{
//         console.log("here")
//         console.log(err)
//       })
//       .on("end", () => {
//         return res.json({
//           data: results.slice(0,10)
//         });
//       });

// }