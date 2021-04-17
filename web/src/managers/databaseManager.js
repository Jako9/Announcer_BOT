const mysql = require('mysql');
const fs = require('fs'); 

const database = process.env.DBNAME;
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;


module.exports = {
    getStatistics: () => {
        return fs.promises.readFile('/web/statistics/statistics.json', "utf8");
    }
}

function establishConnection(){
    let connection = mysql.createConnection({
        host : 'db',
        database : database,
        user     : user,
        password : password,
        charset : 'utf8mb4'
    });

    return connection;
}