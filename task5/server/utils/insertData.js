const db = require('./database')

const insertIntoSQL = async (data) => {
    data = data.map((entry)=>{
        return [entry.name, entry.email, parseInt(entry.age,10), entry.address]
    })
    let query = `INSERT INTO users 
        (name, email, age, address) VALUES ?;`; 

    // Executing the query 
    db.query(query, [data], (err, rows) => { 
        if (err.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry detected');
            // Handle the duplicate entry error gracefully
          } else {
            console.error('Error inserting data:', err);
          }
        console.log("All rows are inserted"); 
    }); 
    
};


module.exports = insertIntoSQL