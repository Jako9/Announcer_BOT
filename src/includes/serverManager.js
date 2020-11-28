const fs = require('fs');
const jsonParser = require('./jsonParser');
const _path = require('path');

let servers = {};

module.exports = {
    addServer: function(id) {
        if(!fs.existsSync(_path.resolve("./config/guilds/" + id + ".json"))){

            jsonParser.copy(_path.resolve("./config/template.json"), _path.resolve("./config/guilds/" + id + ".json"));
            servers[id] = jsonParser.read(_path.resolve("./config/guilds/" + id + ".json"));
        }
    },
    
    
    removeServer: function(id) {
        if(fs.existsSync(_path.resolve("./config/guilds/" + id + ".json"))){

            jsonParser.delete(_path.resolve("./config/guilds/" + id + ".json"));
            delete servers.id;
        }
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
     * Gibt die Rollen des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getRollen: function(id){
        return servers[id].rollen;
    },

    /**
     * Setzt die Rollen des Servers
     *
     * @param {string} id Id des Servers
     * @param {Array} roles Rollen des Servers
     */
    setRollen: function(id, roles){
        servers[id].rollen = (roles) ? roles : servers[id].rollen;
        saveServer(id);
    },

    /**
     * Gibt die Instruktionen des Servers zurück
     *
     * @param {string} id Id des Servers
     */
    getInstructions: function(id){
        instructions = servers[id].instructions;
        descriptions = jsonParser.read(_path.resolve("./config/default.json")).descriptions;
        return mergeArrays(instructions, descriptions);
    },

    /**
     * Setzt die Instruktionen des Servers
     *
     * @param {string} id Id des Servers
     * @param {Array} instructions Instruktionen des Servers
     */
    setInstructions: function(id, instructions){
        if(instructions){
            ins = unMergeArrays(instructions);
            servers[id].instructions = ins;

            saveServer(id);
        }
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
     * Setzt das Prefix des Servers
     *
     * @param {string} id Id des Servers
     * @param {number} volume Volume des Servers
     */
    setVolume: function(id, volume){
        servers[id].volume = (volume) ? volume : servers[id].volume;
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
        console.log("id: " + id + " " + servers[id].channelSize);
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
     * Gibt den Standartchannel des Servers zurück
     *
     * @param {number} id Id des Servers
     */
    getStandartChannel: function(id){
        return servers[id].standartChannel;
    },

    /**
     * Setzt den StandartChannel des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} standartChannel standartChannel des Servers
     */
    setStandartChannel: function(id, standartChannel){
        servers[id].standartChannel = (standartChannel) ? standartChannel : servers[id].standartChannel;
        saveServer(id);
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
     * @param {string} standartRole standartChannel des Servers
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
    getChannelReact: function(id){
        return servers[id].channelReact;
    },

    /**
     * Setzt den ChannelReact des Servers
     *
     * @param {string} id Id des Servers
     * @param {string} channelReact standartChannel des Servers
     */
    setChannelReact: function(id, channelReact){
        servers[id].channelReact = (channelReact) ? channelReact : servers[id].channelReact;
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

    readInServers: function (){
        fs.readdirSync(_path.resolve("./config/guilds/")).forEach(file => { 
            id = file.split(".")[0];
            serverObj = jsonParser.read(_path.resolve("./config/guilds/") + "/" + file);

            serverObj["timeLastJoin"] = 0;
            serverObj["channelSize"] = 0;
            serverObj["whoLocked"] = "";

            servers[id] = serverObj; 
        });
    },
}

function saveServer(id){
    toWrite = servers[id];

    delete toWrite.timeLastJoin;
    delete toWrite.channelSize;
    delete toWrite.whoLocked;
    
    jsonParser.write(_path.resolve("./config/guilds/") + "/" + id + ".json", toWrite);
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