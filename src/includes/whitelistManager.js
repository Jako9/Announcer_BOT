const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

module.exports = {

  show: function(message){
    let channels = serverManager.getWhitelist(message.guild.id);
    if(channels.length == 0){
      message.reply("The whitelist is empty. The bot listens to every channel");
      return;
    }
    let msg = "```\n"
    channels.forEach(channel => msg += (channel.name + "\n"));
    msg += "```";
    message.reply(msg);
  },

  addElem: function(message, prefix, instructions){
    let channels = serverManager.getWhitelist(message.guild.id);
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht hinzugefügt werden(Fehlerhafte Argumente).");
      message.reply('Incorrect usage of \'' + prefix +  instructions[21][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.');
      return;
    }

    let channel = message.mentions.channels.find(channel => true);

    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden. (Der Channel wurde nicht gefunden)");
      message.reply('The channel could not be found.');
      return;
    }

    let ids = [];

    channels.forEach(tmpChannel => {
      ids.push(tmpChannel.id);
    });

    if(ids.includes(channel.id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden. (Der Channel ist schon gewhitelistet)");
      message.reply('This channel is already whitelisted');
      return;
    }

    channels.push({"name":channel.name,"id":channel.id});
    serverManager.setWhitelist(id, channels);
    message.reply("The channel was successfully added.");
  },

  removeElem: function(message, prefix, instructions){
    let channels = serverManager.getWhitelist(message.guild.id);
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht entfernt werden(Fehlerhafte Argumente).");
      message.reply('Incorrect usage of \'' + prefix +  instructions[26][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.');
      return;
    }

    let channel = message.mentions.channels.find(channel => true);

    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden.");
      message.reply('The channel could not be found.');
      return;
    }

    let ids = [];

    channels.forEach(tmpChannel => {
      ids.push(tmpChannel.id);
    });

    if(!ids.includes(channel.id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel ist nicht gewhitelistet.");
      message.reply('This channel is not whitelisted.');
      return;
    }

    let index = ids.indexOf(channel.id);
    channels.splice(index, 1);
    serverManager.setWhitelist(id, channels);
    message.reply("The channel was successfully removed");
  },

  clear: function(message){
    serverManager.setWhitelist(message.guild.id, []);
    message.reply("The whitelist was successfully reseted.");
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
