const expressAsyncHandler = require('express-async-handler')
const db = require('../utils/database')

const paginationController = expressAsyncHandler((req, res)=>{
    console.log(req.body)
    const {page_no} = req.body
    const currPage = page_no
    const nextPage = page_no+1
    const start = currPage*20 + 1
    const end = nextPage*20

    const query =  `SELECT * FROM users WHERE id BETWEEN ? and ?;`

    db.query(query , [start,end] , (err, results)=>{
        if(err){
            return res.status(400).json(err)
        }
        results = results.map(e=>Object.values(e))


        return res.json({
            rows : results,
            page_no : page_no+1
        })
    })

})

module.exports = paginationController