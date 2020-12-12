const fs = require('fs');
const jsonParser = require('./jsonParser');
const logManager = require('./logManager.js');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

let servers = {};

module.exports = {
    addServer: function(guild) {
      //Server existiert schon
      if(fs.existsSync(PATH + "/config/guilds/" + guild.id + ".json")) return;

      jsonParser.copy(PATH + "/config/template.json", PATH + "/config/guilds/" + guild.id + ".json");
      servers[guild.id] = jsonParser.read(PATH + "/config/guilds/" + guild.id + ".json");
      servers[guild.id].name = guild.name;
      servers[guild.id].avatar = guild.iconURL();
      logManager.writeDebugLog(guild.name + ": Der Server wurde erfolgreich hinzugefügt.");
      saveServer(guild.id);
    },

    removeServer: function(guild) {
      //Server existiert nicht
      if(!fs.existsSync(PATH + "/config/guilds/" + guild.id + ".json")) return;

      jsonParser.delete(PATH + "/config/guilds/" + guild.id + ".json");
      logManager.writeDebugLog(guild.name + ": Der Server wurde erfolgreich entfernt.");
      delete servers.id;
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
        return servers[id].rolle;
    },

    /**
     * Setzt die Rolle des Servers
     *
     * @param {string} id Id des Servers
     * @param {String} role Rolle des Servers
     */
    setRolle: function(id, role){
        servers[id].rolle = (role) ? role : servers[id].rolle;
        saveServer(id);
    },

    /**
     * Gibt die Instruktionen des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getInstructions: function(id){
        instructions = servers[id].instructions;
        descriptions = jsonParser.read(PATH + "/config/default.json").descriptions;
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

        servers[id].instructions = unMergeArrays(instructions);
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
        servers[id].whoLocked = (whoLocked) ? whoLocked : servers[id].whoLocked;
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
        servers[id].standartRole = (standartRole) ? standartRole : servers[id].standartRole;
        saveServer(id);
    },

    /**
     * Gibt den ChannelReact des Servers zurück
     *
     * @param {number} id Id des Servers
     */
    getChannelReact: function(guild){
        return guild.channels.cache.find(channel => channel.id == servers[guild.id].channelReact);
    },

    /**
     * Setzt den ChannelReact des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} channelReact standartChannel des Servers
     */
    setChannelReact: function(id, channelReact){
        servers[id].channelReact = (channelReact) ? channelReact.id : servers[id].channelReact;
        saveServer(id);

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
        fs.readdirSync(PATH + "/config/guilds/").forEach(file => {
          try{
              id = file.split(".")[0];
              serverObj = jsonParser.read(PATH + "/config/guilds/" + "/" + file);

              serverObj["timeLastJoin"] = 0;
              serverObj["channelSize"] = 0;
              serverObj["whoLocked"] = "";
              serverObj["reactionMessage"] = null;
              fetchMessage(client, id, serverObj.channelReact);

              servers[id] = serverObj;
              servers[id].name = client.guilds.cache.find(guild => guild.id == id).name;
              servers[id].avatar = client.guilds.cache.find(guild => guild.id == id).iconURL();
              saveServer(id);
            }
            catch(e){
            }
        });
    },

    updateUser: function(client){
        let vips = jsonParser.read(PATH + "/config/vips.json").vips;

        let toWrite = {};

        vips.forEach(vip => {
            let id = vip[0];
            client.users.fetch(id)
            .then(user => {
                //Nutzer nicht gefunden
                if(!user) return;

                vip[1] = user.username;
                vip[2] = user.avatarURL();

                //Nutzer zurück schreiben
                toWrite.vips = vips;
                jsonParser.write(PATH + "/config/vips.json", toWrite);
            })
            .catch();
        });


    }
}

function fetchMessage(client, id, channelReact){
  if(channelReact == "") return;

  //Aua ich weiß es selber danke
  client.guilds.fetch(id).then(guild => guild.channels.cache.find(channel => channel.id == channelReact).messages.fetch().then(messages => client.guilds.fetch(id).then(guild => msg = servers[id].reactionMessage = guild.channels.cache.find(channel => channel.id == channelReact).messages.cache.find(foo => true))));
}

function saveServer(id){
    toWrite = servers[id];
    message = servers[id].reactionMessage;
    delete toWrite.timeLastJoin;
    delete toWrite.channelSize;
    delete toWrite.whoLocked;
    delete toWrite.reactionMessage;

    jsonParser.write(PATH + "/config/guilds/" + "/" + id + ".json", toWrite);
    servers[id].reactionMessage = message;
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
