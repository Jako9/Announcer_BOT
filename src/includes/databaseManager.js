const mysql = require('mysql');
const jsonParser = require('./jsonParser');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

const dbData = jsonParser.read(PATH + "/config/database.json");
const database = dbData.database;
const user = dbData.user;
const password = dbData.password;

let connection = mysql.createConnection({
    host : 'localhost',
    database : database,
    user     : user,
    password : password
});


module.exports = {

    addUser: function(userID, username, avatar, joinsound){
        con = connection.connect();
        
        let q = "INSERT INTO users (userID, username, avatar, isVip, joinsound) VALUES ('"+ userID + "', '" + username + "', '" + avatar + "', '0', '"+ joinsound + "')";

        con.query(q);
        connection.end();
    }
};

