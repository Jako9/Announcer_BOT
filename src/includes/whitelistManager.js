const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

module.exports = {

  show: function(message){
    let channels = serverManager.getWhitelist(message.guild.id);
    if(channels.length == 0){
      message.reply("Die Whitelist ist leer. Der Bot hört auf jeden Channel");
      return;
    }
    let msg = "```"
    channels.forEach(channel => msg += (channel.name + "\n"));
    msg += "```";
    message.reply(msg);
  },

  addElem: function(message, prefix, instructions){
    let channels = serverManager.getWhitelist(message.guild.id);
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht hinzugefügt werden(Fehlerhafte Argumente).");
      message.reply('Ungültige Eingabe für \'' + prefix +  instructions[17][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.');
      return;
    }

    let channel = message.mentions.channels.find(channel => true);

    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden. (Der Channel wurde nicht gefunden)");
      message.reply('Der Channel konnte nicht gefunden werden');
      return;
    }

    let ids = [];

    channels.forEach(tmpChannel => {
      ids.push(tmpChannel.id);
    });

    if(ids.includes(channel.id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden. (Der Channel ist schon gewhitelistet)");
      message.reply('Der Channel konnte nicht gefunden werden');
      return;
    }

    channels.push({"name":channel.name,"id":channel.id});
    serverManager.setWhitelist(id, channels);
    message.reply("Der Channel wurde erfolgreich hinzugefügt");
  },

  removeElem: function(message, prefix, instructions){
    let channels = serverManager.getWhitelist(message.guild.id);
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht entfernt werden(Fehlerhafte Argumente).");
      message.reply('Ungültige Eingabe für \'' + prefix +  instructions[18][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.');
      return;
    }

    let channel = message.mentions.channels.find(channel => true);

    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht gefunden werden.");
      message.reply('Der Channel konnte nicht gefunden werden');
      return;
    }

    let ids = [];

    channels.forEach(tmpChannel => {
      ids.push(tmpChannel.id);
    });

    if(ids.includes(channel.id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel ist nicht gewhitelistet.");
      message.reply('Dieser Channel ist nicht gewhitelistet.');
      return;
    }

    let index = ids.indexOf(channel.id);
    channels.splice(index, 1);
    serverManager.setWhitelist(id, channels);
    message.reply("Der Channel wurde erfolgreich entfernt");
  },

  clear: function(message){
    serverManager.setWhitelist(message.guild.id, []);
    message.reply("Die Whitelist wurde erfolgreich zurückgesetzt.");
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
