const fs = require('fs');
const jsonParser = require('./jsonParser');
const logManager = require('./logManager.js');
const dbManager = require('./databaseManager.js');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

let servers = {};
let descriptions = [];

module.exports = {
    addServer: function(guild) {

      dbManager.addServer(guild.id, guild.name,guild.iconURL(), function(res){
        dbManager.getServer(guild.id, function(dbServer){
          let id = dbServer.guildID;
          dbServer["timeLastJoin"] = 0;
          dbServer["channelSize"] = 0;
          dbServer["whoLocked"] = "";
          dbServer["reactionMessage"] = null;
          dbServer["lockedChannel"] = null;
          dbServer.instructions = JSON.parse(dbServer.instructions).instructions;
          dbServer.whitelist = JSON.parse(dbServer.whitelist).whitelist;
          dbServer.lockable = JSON.parse(dbServer.lockable).lockable;
          dbServer.manageRolle = JSON.parse(dbServer.manageRolle);
          dbServer.standartRole = JSON.parse(dbServer.standartRole);
          dbServer.channelReact = JSON.parse(dbServer.channelReact);

          servers[id] = dbServer;
          logManager.writeDebugLog(guild.name + ": Der Server wurde erfolgreich hinzugefügt.");
          saveServer(guild.id);
        });
      });
    },

    removeServer: function(guild) {

      dbManager.deleteServer(guild.id, function(res){
        logManager.writeDebugLog(guild.name + ": Der Server wurde erfolgreich entfernt.");
        delete servers.id;
      });
    },

    getServers: function() {
        return servers;
    },

    /**
     * Gibt das Server-Object zurück
     *
     * @param {string} id Id des Servers
     */
    getServer: function(id){
        return servers.filter((item) => {
            return item.id == id;
        });
    },

    /**
     * Gibt die Rolle des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getRolle: function(id){
        return servers[id].manageRolle;
    },

    /**
     * Setzt die Rolle des Servers
     *
     * @param {string} id Id des Servers
     * @param {String} role Rolle des Servers
     */
    setRolle: function(id, manageRolle){
        servers[id].manageRolle = manageRolle;
        saveServer(id);
    },

    /**
     * Gibt die Instruktionen des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getInstructions: function(id){
        instructions = [];
        servers[id].instructions.forEach(inst =>{
            instructions[inst.type-1] = inst.name;
        });

        return mergeArrays(instructions, descriptions);
    },

    /**
     * Setzt die Instruktionen des Servers
     *
     * @param {string} id Id des Servers
     * @param {Array} instructions Instruktionen des Servers
     */
    setInstructions: function(id, instructions){
        if(!instructions) return;

        instructionsTmp = [];

        for(i=1; i <= instructions.length; i++){
            instructionsTmp.push({
                "name": instructions[i-1][0],
                "type": i
            });
        }

        servers[id].instructions = instructionsTmp;

        saveServer(id);

    },

    /**
     * Gibt den letzten Zeitpunkt des Joinens auf dem Server zurück
     *
     * @param {string} id Id des Servers
     */
    getTimeLastJoin: function(id){
        return servers[id].timeLastJoin;
    },

    /**
     * Setzt den letzten Zeitpunkt des Joinens auf den Servers
     *
     * @param {string} id Id des Servers
     * @param {number} joinTime Jointime des Bots auf den Server
     */
    setTimeLastJoin: function(id, joinTime){
        servers[id].timeLastJoin = (joinTime) ? joinTime : servers[id].timeLastJoin;
    },

    /**
     * Gibt das Prefix des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getPrefix: function(id){
        return servers[id].prefix;
    },

    /**
     * Setzt das Prefix des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} prefix Prefix des Servers
     */
    setPrefix: function(id, prefix){
        servers[id].prefix = (prefix) ? prefix : servers[id].prefix;
        saveServer(id);
    },

    /**
     * Gibt das Volume des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getVolume: function(id){
        return servers[id].volume;
    },

    /**
     * Setzt das Volume des Servers
     *
     * @param {string} id Id des Servers
     * @param {number} volume Volume des Servers
     */
    setVolume: function(id, volume){
        servers[id].volume = volume;
        saveServer(id);
    },

    /**
     * Gibt die Channelsize des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getChannelSize: function(id){
        return servers[id].channelSize;
    },

    /**
     * Setzt die Channelsize des Servers
     *
     * @param {string} id Id des Servers
     * @param {number} channelSize Channelsize des Servers
     */
    setChannelSize: function(id, channelSize){
        servers[id].channelSize = (channelSize !== undefined) ? channelSize : servers[id].channelSize;
    },

    /**
     * Gibt die UserId des Users zurück der gelockt hat des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getWhoLocked: function(id){
        return servers[id].whoLocked;
    },

    /**
     * Setzt die Channelsize des Servers
     *
     * @param {string} id Id des Servers
     * @param {number} whoLocked UserId der den Server zuletzt gelockt hat
     */
    setWhoLocked: function(id, whoLocked){
        servers[id].whoLocked =  whoLocked;
    },

    /**
     * Gibt den StandartRole des Servers zurück
     *
     * @param {number} id Id des Servers
     */
    getStandartRole: function(id){
        return servers[id].standartRole;
    },

    /**
     * Setzt den StandartRole des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} standartRole standartRolel des Servers
     */
    setStandartRole: function(id, standartRole){
        servers[id].standartRole = standartRole;
        saveServer(id);
    },

    /**
     * Gibt den ChannelReact des Servers zurück
     *
     * @param {number} id Id des Servers
     */
    getChannelReact: function(guild){
        return guild.channels.cache.find(channel => channel.id == servers[guild.id].channelReact.id);
    },

    /**
     * Setzt den ChannelReact des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} channelReact standartChannel des Servers
     */
    setChannelReact: function(id, channelReact){
      if(channelReact == null){
        servers[id].channelReact = {"name": "", "id":""};
        servers[id].reactionMessage = null;
        saveServer(id);
      }
      else{
        servers[id].channelReact = {"name":channelReact.name, "id": channelReact.id};
        saveServer(id);
      }

    },

    /**
     * Gibt die reactionMessage des Servers zurück
     *
     * @param {number} id Id des Servers
     */
    getReactionMessage: function(id){
        return servers[id].reactionMessage;
    },

    /**
     * Gibt die whitelist des Servers zurück
     *
     * @param {number} id Id des Servers
     */
    getWhitelist: function(id){
        return servers[id].whitelist;
    },

    /**
     * Setzt den ChannelReact des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} whitelist whitelist des Servers
     */
    setWhitelist: function(id, whitelist){
        servers[id].whitelist = whitelist;
        saveServer(id);

    },

    /**
     * Gibt den abgeschlossenen Channel des Servers zurück (falls nicht abgeschlossen => null)
     *
     * @param {number} id Id des Servers
     */
    getLockedChannel: function(id){
        return servers[id].lockedChannel;
    },

    /**
     * Setzt den abgeschlossenen Channel des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} lockedChannel abgeschlossener des Servers
     */
    setLockedChannel: function(id, lockedChannel){
        servers[id].lockedChannel = lockedChannel;
    },

    /**
     * Gibt die Liste aller Channel, die man abschließen darf des Servers zurück
     *
     * @param {number} id Id des Servers
     */
    getLockable: function(id){
        return servers[id].lockable;
    },

    /**
     * Setzt die channel, die man abschließen darf auf lockable
     *
     * @param {string} id Id des Servers
     * @param {string} lockable whitelist des Servers
     */
    setLockable: function(id, lockable){
        servers[id].lockable = lockable;
        saveServer(id);

    },

    /**
     * Setzt die ReactionMessage des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} reactionMessage ReactionMessage des Servers
     */
    setReactionMessage: function(id, reactionMessage){
        servers[id].reactionMessage = (reactionMessage) ? reactionMessage : servers[id].reactionMessage;
        saveServer(id);

    },

    readInServers: function (client){
      let ids = [];
      let names = [];
      let avatars = [];
      client.guilds.cache.array().forEach(guild => {
        ids.push(guild.id);
        names.push(guild.name);
        avatars.push(guild.iconURL());
      });

      dbManager.syncServers(ids,names,avatars, function(worked){
        dbManager.readInServers(function(dbServers){
            dbServers.forEach(dbServer => {
            let id = dbServer.guildID;
            dbServer["timeLastJoin"] = 0;
            dbServer["channelSize"] = 0;
            dbServer["whoLocked"] = null;
            dbServer["reactionMessage"] = null;
            dbServer["lockedChannel"] = null;
            dbServer.instructions = JSON.parse(dbServer.instructions).instructions;
            dbServer.whitelist = JSON.parse(dbServer.whitelist).whitelist;

            dbServer.lockable = JSON.parse(dbServer.lockable).lockable;

            dbServer.manageRolle = JSON.parse(dbServer.manageRolle);

            dbServer.standartRole = JSON.parse(dbServer.standartRole);

            dbServer.channelReact = JSON.parse(dbServer.channelReact);

            fetchMessage(client, id, dbServer.channelReact);

            servers[id] = dbServer;
            servers[id].name = client.guilds.cache.find(guild => guild.id == id).name;
            servers[id].avatar = client.guilds.cache.find(guild => guild.id == id).iconURL();
            saveServer(id);
            });
        });
      });
    },

    readInDescriptions: function (){
        dbManager.readInDescriptions(function(descs){
            descs.forEach(desc =>{
                descriptions[desc.explanationID-1] = desc.explanation;
            });
        });
    },

    updateUser: function(client){
        dbManager.getVips(function(vips){
          vips.forEach(vip => {
              let id = vip.userID;
              client.users.fetch(id)
              .then(user => {
                  //Nutzer nicht gefunden
                  if(!user) return;

                  dbManager.setInformation(user.id,user.username,user.avatarURL(), function(succ){});
              })
              .catch();
          });
        });
    }
}

function fetchMessage(client, id, channelReact){
  if(channelReact.id == "") return;
  //Ich schwöre Lambda wtf reicht auch
  client.guilds.fetch(id).then(guild => {
    guild.channels.cache.find(channel => channel.id == channelReact.id).messages.fetch().then(messages => {
      client.guilds.fetch(id).then(guild => {
        servers[id].reactionMessage = guild.channels.cache.find(channel => channel.id == channelReact.id).messages.cache.find(message => message.pinned);
      });
    });
  });
}

function saveServer(id){
    let toWrite = servers[id];
    let message =  servers[id].reactionMessage;
    let lockedChannel = servers[id].lockedChannel;
    delete toWrite.timeLastJoin;
    delete toWrite.channelSize;
    delete toWrite.whoLocked;
    delete toWrite.reactionMessage;
    delete toWrite.lockedChannel;
    let instructionsTmp = servers[id].instructions;
    let whitelist = servers[id].whitelist;
    let lockable = servers[id].lockable;
    let manageRolle = servers[id].manageRolle;
    let standartRole = servers[id].standartRole;
    let channelReact = servers[id].channelReact;
    servers[id].whitelist = JSON.stringify({"whitelist":servers[id].whitelist});

    servers[id].lockable = JSON.stringify({"lockable":servers[id].lockable});

    servers[id].instructions = JSON.stringify({"instructions" : servers[id].instructions});

    servers[id].manageRolle = JSON.stringify(servers[id].manageRolle);

    servers[id].standartRole = JSON.stringify(servers[id].standartRole);

    servers[id].channelReact = JSON.stringify(servers[id].channelReact);

    dbManager.saveServer(servers[id], id, function(worked){});
    servers[id].instructions = instructionsTmp;
    servers[id].reactionMessage = message;
    servers[id].whitelist = whitelist;
    servers[id].lockable = lockable;
    servers[id].lockedChannel = lockedChannel;
    servers[id].manageRolle = manageRolle;
    servers[id].standartRole = standartRole;
    servers[id].channelReact = channelReact;
}

function mergeArrays(a, b){
    let merged = [];
    for (i = 0; i < a.length; i++) {
        merged.push([a[i], b[i]]);
    }

    return merged;
}

function unMergeArrays(a){
    let merged = [];
    for (i = 0; i < a.length; i++) {
        merged.push(a[i][0]);
    }

    return merged;
}
