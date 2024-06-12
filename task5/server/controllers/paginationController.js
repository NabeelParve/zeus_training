const expressAsyncHandler = require('express-async-handler')
const db = require('../utils/database')

const paginationController = expressAsyncHandler((req, res) => {
    const { page_no, sort, search } = req.body;
    const start = page_no * 20;

    let query = `SELECT * FROM users `;

    if (search && search !== "") {
        query += `WHERE email LIKE '${search}%' `;
    }

    if (sort && sort !== "undefined") {
        query += `ORDER BY ${sort} `;
    }

    query += `LIMIT 20 OFFSET ?;`;


    db.query(query, [start], (err, results) => {
        if (err) {
            return res.status(400).json(err)
        }
        results = results.map(e => Object.values(e))


        return res.json({
            rows: results,
            page_no: page_no + 1
        })
    })

})

module.exports = paginationController