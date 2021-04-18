const mysql = require('mysql');
const fs = require('fs'); 

const database = process.env.DBNAME;
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;


module.exports = {
    getStatistics: () => {
        return fs.promises.readFile('/web/statistics/statistics.json', "utf8");
    },

    getErrorlog: () => {
        return fs.promises.readFile('/web/logs/error_log.log', "utf8");
    },

    getDebuglog: () => {
        return fs.promises.readFile('/web/logs/debug.log', "utf8");
    },

    getBootlog: () => {
        return fs.promises.readFile('/web/logs/boot_log.log', "utf8");
    },

    resetErrorlog: () => {
        return fs.promises.writeFile('/web/logs/error_log.log', "");
    },

    resetDebuglog: () => {
        return fs.promises.writeFile('/web/logs/debug.log', "");
    },

    resetBootlog: () => {
        return fs.promises.writeFile('/web/logs/boot_log.log', "");
    },

    getServers: (callback) => {
        let connection = establishConnection();

        let q = "SELECT * FROM server";

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
              callback(results);
            }
        });
        connection.end();
    },

    getVips: (callback) => {
        let connection = establishConnection();

        let q = "SELECT * FROM users WHERE isVip=1";

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
              callback(results);
            }
        });
        connection.end();
    },

    updateServer: (id, prefix, volume, callback) => {
        let connection = establishConnection();

        let q = "UPDATE server SET prefix=?, volume=? WHERE guildID=?";

        connection.query(q, [prefix, volume, id], (error, results) => {
            if(error){
                throw error;
            }else{
              callback(true);
            }
        });
        connection.end();
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