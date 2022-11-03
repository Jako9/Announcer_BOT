const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

module.exports = {

  show: function(message){
    let channels = serverManager.getWhitelist(message.guild.id);
    if(channels.length == 0){
      message.reply({content: "The whitelist is empty. The bot listens to every channel", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    let msg = "```\n"
    channels.forEach(channel => msg += (channel.name + "\n"));
    msg += "```";
    message.reply({content: msg, allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
  },

  addElem: function(message, prefix, instructions){
    let channels = serverManager.getWhitelist(message.guild.id);
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht hinzugefügt werden(Fehlerhafte Argumente).");
      message.reply({content: 'Incorrect usage of \'' + prefix +  instructions[21][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    let channel = message.mentions.channels.find(channel => true);

    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden. (Der Channel wurde nicht gefunden)");
      message.reply({content: 'The channel could not be found.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    let ids = [];

    channels.forEach(tmpChannel => {
      ids.push(tmpChannel.id);
    });

    if(ids.includes(channel.id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden. (Der Channel ist schon gewhitelistet)");
      message.reply({content: 'This channel is already whitelisted', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    channels.push({"name":channel.name,"id":channel.id});
    serverManager.setWhitelist(id, channels);
    message.reply({content: "The channel was successfully added.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
  },

  removeElem: function(message, prefix, instructions){
    let channels = serverManager.getWhitelist(message.guild.id);
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht entfernt werden(Fehlerhafte Argumente).");
      message.reply({content: 'Incorrect usage of \'' + prefix +  instructions[26][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    let channel = message.mentions.channels.find(channel => true);

    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden.");
      message.reply({content: 'The channel could not be found.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    let ids = [];

    channels.forEach(tmpChannel => {
      ids.push(tmpChannel.id);
    });

    if(!ids.includes(channel.id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel ist nicht gewhitelistet.");
      message.reply({content: 'This channel is not whitelisted.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    let index = ids.indexOf(channel.id);
    channels.splice(index, 1);
    serverManager.setWhitelist(id, channels);
    message.reply({content: "The channel was successfully removed", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
  },

  clear: function(message){
    serverManager.setWhitelist(message.guild.id, []);
    message.reply({content: "The whitelist was successfully reseted.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
  },

  isValid: function(message){
    let channels = serverManager.getWhitelist(message.guild.id);

    if (channels.length == 0) return true;

    let found = false;
    channels.forEach(channel => {
      if (channel.id == message.channel.id) found = true;
    });

    return found;
  }
}
