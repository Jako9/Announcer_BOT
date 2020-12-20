const mysql = require('mysql');
const jsonParser = require('./jsonParser');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

const dbData = jsonParser.read(PATH + "/config/database.json");
const database = dbData.database;
const user = dbData.user;
const password = dbData.password;


module.exports = {

    addUser: function(userID, username, avatar, joinsound){
        connection = establishConnection();

        let q = "INSERT INTO users (userID, username, avatar, isVip, joinsound) VALUES ('"+ userID + "', '" + username + "', '" + avatar + "', '0', '"+ joinsound + "')";

        connection.query(q, (error) => {
            if(error){
                return false;
            }

            return true;
        });


        connection.end();

        return true;
    },

    getAllUsers: function(){
        connection = establishConnection();

        let q = "SELECT * FROM users";

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    },

    getUser: function(userID){
        connection = establishConnection();

        let q = "SELECT * FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    },

    getVip: function(userID){
        connection = establishConnection();

        let q = "SELECT isVip FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    },

    setVip: function(userID){
        connection = establishConnection();

        let q = "UPDATE users SET isVIP=1 WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    },

    getName: function(userID){
        connection = establishConnection();

        let q = "SELECT username FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    },

    setInformation: function(userID, username, avatar){
        connection = establishConnection();

        let q = "UPDATE users SET username="+ username +", avatar="+ avatar +" WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    },

    getJoinsound: function(userID){
        connection = establishConnection();

        let q = "SELECT joinsound FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    },

    setJoinsound: function(userID, joinsound){
        connection = establishConnection();

        let q = "UPDATE users SET joinsound="+ joinsound +" WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                return false;
            }

            return results;
        });
        connection.end();
    }
};

function establishConnection(){
    return connection = mysql.createConnection({
        host : 'localhost',
        database : database,
        user     : user,
        password : password
    });
}
