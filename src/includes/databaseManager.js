const mysql = require('mysql');
const jsonParser = require('./jsonParser');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

const logManager = require('./logManager.js');

const dbData = jsonParser.read(PATH + "/config/database.json");
const database = dbData.database;
const user = dbData.user;
const password = dbData.password;


module.exports = {

    addUser: function(userID, username, avatar, joinsound, callback){
        connection = establishConnection();

        logManager.writeDebugLog("1");
        let q = "INSERT INTO users (userID, username, avatar, isVip, joinsound) VALUES (? , ? , ? , ?)";
        logManager.writeDebugLog("2");
        connection.query(q, [
          userID,
          username,
          avatar,
          joinsound
        ] ,(error, results) => {
          logManager.writeDebugLog("3: " + error);
          logManager.writeDebugLog("4: " + results);
            if(error == undefined){
                callback(results);
            }
            else{
              callback(false);
            }
        });
        connection.end();
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

    setVip: function(user, callback){
        connection = establishConnection();

        let q = "INSERT INTO users (userID,username,avatar,isVIP) VALUES ('"+ user.id + "', '" + user.username + "', '" + user.avatarURL() + "', '1')";
        q += " ON DUPLICATE KEY UPDATE isVIP = 1";

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

    syncServers: function(ids, names, avatars, callback){
      connection = establishConnection();
      let q = "INSERT INTO server (guildID,name,avatar) VALUES ";
      for(let i = 0; i < ids.length; i++){
        q += "(" + ids[i] + ", '" + names[i] + "','" + avatars[i] + "'),";
      }
      q = q.substring(0,q.length-1);
      q += "ON DUPLICATE KEY UPDATE name = name, avatar = avatar";

      connection.query(q, (error, results) => {
          if(!error){
              callback(results);
          }
          else{
            callback(false);
          }
      });
      connection.end();
    },

    saveServer: function(server, id, callback){
        connection = establishConnection();
        let name = server.name;
        let avatar= server.avatar;
        let manageRolle= server.manageRolle;
        let whitelist = server.whitelist;
        let instructions= server.instructions;
        let prefix= server.prefix;
        let volume= server.volume;
        let standartRole= server.standartRole;
        let channelReact= server.channelReact;
        let lockable= server.lockable;
        let q = "UPDATE server SET name='"+ name + "',avatar='" + avatar +"', manageRolle='"+ manageRolle + "', instructions='"+ instructions + "', whitelist='" + whitelist + "', prefix='"+ prefix + "', volume="+ volume +", standartRole='"+ standartRole + "', channelReact='"+ channelReact + "', lockable='" + lockable +"' WHERE guildID=" + id;

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

    deleteServer: function(guildID, callback){
      connection = establishConnection();

      let q = "DELETE FROM server WHERE guildID=" + guildID;

      connection.query(q, (error, results) => {
          if(error){
              throw error;
          }else{
              callback(results);
          }
      });

      connection.end();

    },

    addServer: function(guildID, guildName, avatar, callback){
        connection = establishConnection();

        let q = "INSERT INTO server (guildID, name, avatar) VALUES ('"+ guildID + "', '" + guildName + "', '" + avatar + "')";

        connection.query(q, (error, results) => {
            if(!error){
                callback(results);
            }
        });
        connection.end();

    },

    getServer: function(guildID, callback){
      let connection = establishConnection();

      let q = "SELECT * FROM server WHERE guildID=" + guildID;

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
    },

    createPendingPayment: function(transactionID, userID, link, status,  callback){
        connection = establishConnection();

        let q = "INSERT INTO pending_payments (transID, userID, link, status) VALUES ('"+ transactionID + "', '" + userID + "', '" + link + "', '" + status + "')";

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results){
                    callback(true);
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    getPaymentLink: function(userID, callback){
        connection = establishConnection();

        let q = "SELECT link FROM pending_payments WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results.length != 0){
                    callback(results[0].link);
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    getPaymentStatus: function(userID, callback){
        connection = establishConnection();

        let q = "SELECT status FROM pending_payments WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results.length != 0){
                    callback(results[0].status);
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    getUserPayment: function(userID, callback){
        connection = establishConnection();

        let q = "SELECT * FROM pending_payments WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                if(results.length != 0){
                    callback(true);
                }else{
                    callback(false);
                }
            }
        });
        connection.end();
    },

    deletePayment: function(userID, callback){
        let connection = establishConnection();

        let q = "DELETE FROM pending_payments WHERE userID=" + userID;

        connection.query(q, (error, results) => {
            if(error){
                throw error;
            }else{
                callback(results);
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
