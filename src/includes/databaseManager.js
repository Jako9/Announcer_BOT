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

        connection.query(q, (error, results) => {
            if(!error){
                out = results;
            }
        });
        connection.end();

        return out;
    },

    getAllUsers: function(callback){
        connection = establishConnection();

        let q = "SELECT userID FROM users";

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results){
                    callback(results);
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    getUser: function(userID, callback){
        let connection = establishConnection();

        let q = "SELECT * FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results){
                    callback(results[0]);
                }else{
                    callback(false);
                }
            }
        });

        connection.end();
    },

    removeUser: function(userID, callback){
        let connection = establishConnection();

        let q = "DELETE FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                callback(results);
            }
        });

        connection.end();
    },

    getVip: function(userID, callback){
        connection = establishConnection();

        let q = "SELECT isVip FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(typeof results !== 'undefined' && results !== null){
                    if(results.length != 0){
                        callback(results[0].isVip);
                    }else{
                        callback(false);
                    }
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    setVip: function(userID, callback){
        connection = establishConnection();

        let q = "UPDATE users SET isVIP=1 WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(typeof results !== 'undefined' && results !== null){
                    if(results.length != 0){
                        callback(results[0]);
                    }else{
                        callback(false);
                    }
                }else{
                    callback(false);
                }
            }
        });
        connection.end();

    },

    getName: function(userID, callback){
        connection = establishConnection();

        let q = "SELECT username FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(typeof results !== 'undefined' && results !== null){
                    if(results.length != 0){
                        callback(results[0].username);
                    }else{
                        callback(false);
                    }
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    getVips: function(callback){
        connection = establishConnection();

        let q = "SELECT userID FROM users WHERE isVip=1";

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(typeof results !== 'undefined' && results !== null){
                    if(results.length != 0){
                        callback(results);
                    }else{
                        callback(false);
                    }
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    setInformation: function(userID, username, avatar, callback){
        connection = establishConnection();

        let q = "UPDATE users SET username='"+ username +"', avatar='"+ avatar +"' WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
              callback(true);
            }
        });
        connection.end();
    },

    saveServer: function(server, id, callback){
        connection = establishConnection();
        let name = server.name;
        let avatar= server.avatar;
        let rolle= server.rolle;
        let whitelist = Json.stringify({"whitelist":server.whitelist});
        let instructions= server.instructions;
        let prefix= server.prefix;
        let volume= server.volume;
        let standartRole= server.standartRole;
        let channelReact= server.channelReact;
        let q = "UPDATE server SET name='"+ name + "',avatar='" + avatar +"', rolle='"+ rolle + "', instructions='"+ instructions + "', whitelist='" + whitelist + "', prefix='"+ prefix + "', volume="+ volume +", standartRole='"+ standartRole + "', channelReact='"+ channelReact +"' WHERE guildID=" + id;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
              callback(true);
            }
        });
        connection.end();
    },

    getJoinsound: function(userID, callback){
        connection = establishConnection();

        let q = "SELECT joinsound FROM users WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(typeof results !== 'undefined' && results !== null){
                    if(results.length != 0){
                        callback(results[0].joinsound);
                    }else{
                        callback(false);
                    }
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    setJoinsound: function(userID, joinsound, callback){
        connection = establishConnection();

        let q = "UPDATE users SET joinsound="+ joinsound +" WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
              callback(true);
            }
        });
        connection.end();
    },

    readInServers: function(callback){
        connection = establishConnection();

        let q = "SELECT * FROM server";

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results){
                    callback(results);
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    readInDescriptions: function(callback){
        connection = establishConnection();

        let q = "SELECT * FROM instruction_explanation";

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results){
                    callback(results);
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    }
};

function establishConnection(){
    let connection = mysql.createConnection({
        host : 'localhost',
        database : database,
        user     : user,
        password : password,
        charset : 'utf8mb4'
    });

    return connection;
}
