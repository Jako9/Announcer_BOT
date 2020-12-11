const serverManager = require('./serverManager.js');

//Schließ einen abgeschlossenen Raum wieder auf
function lockChannel (member){
  let channel = member.voice.channel;
  serverManager.setChannelSize(channel.guild.id, channel.userLimit);
  serverManager.setWhoLocked(channel.guild.id,member.id);
  channel.setUserLimit(1);
}

//Schließt einen Raum ab
function unlockChannel(voiceChannel){
  let id = voiceChannel.guild.id;
  serverManager.setWhoLocked(id, null);
  voiceChannel.setUserLimit(serverManager.getChannelSize(id));
}

module.exports = {
    lock: function (message){
      if(!message.member.voice.channel){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Der Benutzer sitzt in keinem Channel).");
        message.reply('Du musst erst einem Channel beitreten, der abgeschlossen werden darf!');
        return;
      }
      if(serverManager.setWhoLocked(message.guild.id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Es ist schon abgeschlossen).");
        message.reply('Es ist schon abgeschlossen.');
        return;
      }
      lockChannel(message.member);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde abgeschlossen.");
      message.reply('Abgeschlossen');
    },

    unlock: function(message){
      let id = message.guild.id;
      if(!serverManager.getWhoLocked(id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Es war nichts abgeschlossen).");
        message.reply('Es ist nichts abgeschlossen!');
        return;
      }
      if(message.member != serverManager.getWhoLocked(id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Channel wurde von einem anderen Benutzer abgeschlossen).");
        message.reply('Es kann nur die Person aufschließen, die auch abgeschlossen hat!');
        return;
      }
      unlockChannel(message.member.voice.channel);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde aufgeschlossen.");
      message.reply('Aufgeschlossen');
    },
}
