const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

//Schließ einen abgeschlossenen Raum wieder auf
function lockChannel (message){
  let channel = message.member.voice.channel;
  serverManager.setChannelSize(channel.guild.id, channel.userLimit);
  serverManager.setWhoLocked(channel.guild.id,message.member.id);
  serverManager.setLockedChannel(channel.guild.id, message.member.voice.channel);
  channel.setUserLimit(message.member.voice.channel.members.size);
}

//Schließt einen Raum ab
function unlockChannel(voiceChannel){
  let id = voiceChannel.guild.id;
  serverManager.setWhoLocked(id, null);
  serverManager.setLockedChannel(voiceChannel.guild.id, null);
  voiceChannel.setUserLimit(serverManager.getChannelSize(id));
}

module.exports = {
    lock: function (message){
      //User in keinem Channel
      if(!message.member.voice.channel){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Der Benutzer sitzt in keinem Channel).");
        message.reply('Du musst erst einem Channel beitreten, der abgeschlossen werden darf!');
        return;
      }
      //Channel nicht abschließbar
      let ids = []
      serverManager.getLockable(message.guild.id).forEach(channel => {
        ids.push(channel.id);
      });
      if(!ids.includes(message.member.voice.channel.id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Der Channel ist nicht abschließbar).");
        message.reply('Den Channel in dem du dich befindest, darf man nicht abschließen. Wenn du dies ändern willst, rede mit einem Admin.');
        return;
      }
      if(serverManager.getWhoLocked(message.guild.id) != null){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Es ist schon abgeschlossen).");
        message.reply('Es ist schon abgeschlossen.');
        return;
      }
      lockChannel(message);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde abgeschlossen.");
      message.reply('Abgeschlossen');
    },

    unlock: function(message){
      let id = message.guild.id;
      if(serverManager.getWhoLocked(id) == null){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Es war nichts abgeschlossen).");
        message.reply('Es ist nichts abgeschlossen!');
        return;
      }
      if(message.member != serverManager.getWhoLocked(id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Channel wurde von einem anderen Benutzer abgeschlossen).");
        message.reply('Es kann nur die Person aufschließen, die auch abgeschlossen hat!');
        return;
      }
      logManager.writeDebugLog("Channel = " + message.member.voice.channel);
      unlockChannel(message.member.voice.channel);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde aufgeschlossen.");
      message.reply('Aufgeschlossen');
    },

    lockableClear: function(message){
      serverManager.setLockable(message.guild.id, []);
      logManager.writeDebugLog(message.guild.name + ": Die abzuschließenden Channel wurden zurückgesetzt.");
      message.reply("Die abzuschließenden Channel wurden zurückgesetzt.");
    },

    showLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(channels.length == 0){
        message.reply("Es gibt keine Channel, die man abschließen darf");
        return;
      }
      let msg = "```\n"
      channels.forEach(channel => msg += (channel.name + "\n"));
      msg += "```";
      message.reply(msg);
    },

    forceUnlock: function(voiceState){
      if(serverManager.getWhoLocked(voiceState.guild.id) == voiceState.member.id){
        unlockChannel(voiceState.channel);
      }
    },

    crashUnlock: function(id){
      if(serverManager.getLockedChannel(id) != null){
        unlockChannel(serverManager.getLockedChannel(id));
      }
    },

    addLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(!message.member.voice.channel){
        message.reply("Betrete erst den Channel, den du abschließbar machen willst und führe dann diesen Befehl erneut aus.");
        return;
      }
      let ids = []
      channels.forEach(channel => {
        ids.push(channel.id);
      });
      if(!ids.includes(message.member.voice.channel.id)){
        message.reply("Der Channel ist schon abschließbar.");
        return;
      }
      channels.push({"name":message.member.voice.channel.name, "id":message.member.voice.channel.id});
      serverManager.setLockable(message.guild.id, channels);
      message.reply(message.member.voice.channel.name + " ist nun abschließbar!");
    },

    removeLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(!message.member.voice.channel){
        message.reply("Betrete erst den Channel, den du entfernen willst und führe dann diesen Befehl erneut aus.");
        return;
      }
      let ids = []
      serverManager.getLockable(message.guild.id).forEach(channel => {
        ids.push(channel.id);
      });
      if(!ids.includes(message.member.voice.channel.id)){
        message.reply("Der Channel ist überhaupt nicht abschließbar.");
        return;
      }
      let index = ids.indexOf(message.member.voice.channel.id);
      channels.splice(index, 1);
      serverManager.setLockable(message.guild.id, channels);
      message.reply(message.member.voice.channel.name + " ist nun nicht mehr abschließbar!");
    }
}
