const mysql = require('mysql');
const jsonParser = require('./jsonParser');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

const logManager = require('./logManager.js');

const dbData = jsonParser.read(PATH + "/config/database.json");
const database = dbData.database;
const user = dbData.user;
const password = dbData.password;


module.exports = {

    addUser: function(userID, username, avatar, joinsound){
        connection = establishConnection();

        out = false;

        let q = "INSERT INTO users (userID, username, avatar, isVip, joinsound) VALUES ('"+ userID + "', '" + username + "', '" + avatar + "', '0', '"+ joinsound + "')";

        connection.query(q, (error) => {
            if(!error){
                out = results;
            }
        });
        connection.end();

        return out;
    },

    getAllUsers: function(){
        connection = establishConnection();

        out = false;

        let q = "SELECT userID FROM users";

        connection.query(q, (error, results) => {
            if(!error && results != null){
                out = results;
            }

        });
        connection.end();
        return out;
    },

    getUser: function(userID){
        connection = establishConnection();

        out = false;

        connection.connect(function(err){
            if(err) throw err;
            let q = "SELECT * FROM users WHERE userID=" + userID;

            connection.query(q, [true], (error, results, fields) => {
                if(error){
                    throw err;
                }else{
                    out = results;
                }
            });
         });
        connection.end();
        return out;
    },

    getVip: function(userID){
        connection = establishConnection();

        out = false;

        let q = "SELECT isVip FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(!error){
                out = results;
            }
        });
        connection.end();

        return out;
    },

    setVip: function(userID){
        connection = establishConnection();
        out = false;

        let q = "UPDATE users SET isVIP=1 WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(!error){
                out = results;
            }
        });
        connection.end();

        return out;
    },

    getName: function(userID){
        connection = establishConnection();
        out = false;

        let q = "SELECT username FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(!error){
                out = results;
            }

        });
        connection.end();
        return out;
    },

    setInformation: function(userID, username, avatar){
        connection = establishConnection();
        out = false;

        let q = "UPDATE users SET username="+ username +", avatar="+ avatar +" WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(!error){
                out = results;
            }
        });
        connection.end();
        return out;
    },

    getJoinsound: function(userID){
        connection = establishConnection();
        
        out = false;
        
        let q = "SELECT joinsound FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(!error){
                out = results;
            }
        });
        connection.end();
        return out;
    },

    setJoinsound: function(userID, joinsound){
        connection = establishConnection();

        out = false;
        
        let q = "UPDATE users SET joinsound="+ joinsound +" WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(!error){
                out = true;
            }
        });
        connection.end();
        return out;
    }
};

function establishConnection(){
    connection = mysql.createConnection({
        host : 'localhost',
        database : database,
        user     : user,
        password : password
    });

    return connection;
}
