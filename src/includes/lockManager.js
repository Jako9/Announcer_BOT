const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

//Schließ einen abgeschlossenen Raum wieder auf
function lockChannel (message){
  let channel = message.member.voice.channel;
  serverManager.setChannelSize(channel.guild.id, channel.userLimit);
  serverManager.setWhoLocked(channel.guild.id,message.member.id);
  channel.setUserLimit(message.member.voice.channel.members.size).then(limChannel =>{
    logManager.writeDebugLog("1 Umbenannt");
    let name = "🔒 " + channel.name;
    limChannel.setName(name).then(limChannel2 => {
      logManager.writeDebugLog("Channelname = " + limChannel2.name);
    }).catch(err => {
      logManager.writeDebugLog("ERROR: " + err);
    });
  }).catch(err => {
    logManager.writeDebugLog("1 NICHT Umbenannt: " + err);
  });
}

//Schließt einen Raum ab
function unlockChannel(voiceChannel){
  let id = voiceChannel.guild.id;
  serverManager.setWhoLocked(id, null);
  voiceChannel.setUserLimit(serverManager.getChannelSize(id)).then(unlimChannel =>{
    if(unlimChannel.name.startsWith("🔒 ")){
      logManager.writeDebugLog("2 Umbenannt");
      let name = unlimChannel.name.substring(2,unlimChannel.name.length);
      unlimChannel.setName(name).catch();
    }
  }).catch(err => {
    logManager.writeDebugLog("2 NICHT Umbenannt: " + err);
  });
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
      if(!serverManager.getLockable(message.guild.id).includes(message.member.voice.channel.name)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Der Channel ist nicht abschließbar).");
        message.reply('Den Channel in dem du dich befindest, darf man nicht abschließen. Wenn du dies ändern willst, rede mit einem Admin.');
        return;
      }
      if(serverManager.setWhoLocked(message.guild.id)){
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
      let msg = "```"
      channels.forEach(channel => msg += (channel + "\n"));
      msg += "```";
      message.reply(msg);
    },

    addLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(!message.member.voice.channel){
        message.reply("Betrete erst den Channel, den du abschließbar machen willst und führe dann diesen Befehl erneut aus.");
        return;
      }
      if(channels.includes(message.member.voice.channel.name)){
        message.reply("Der Channel ist schon abschließbar.");
        return;
      }
      channels.push(message.member.voice.channel.name);
      serverManager.setLockable(message.guild.id, channels);
      message.reply(message.member.voice.channel.name + " ist nun abschließbar!");
    },

    removeLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(!message.member.voice.channel){
        message.reply("Betrete erst den Channel, den du entfernen willst und führe dann diesen Befehl erneut aus.");
        return;
      }
      if(!channels.includes(message.member.voice.channel.name)){
        message.reply("Der Channel ist überhaupt nicht abschließbar.");
        return;
      }
      let index = channels.indexOf(message.member.voice.channel.name);
      channels.splice(index, 1);
      serverManager.setLockable(message.guild.id, channels);
      message.reply(message.member.voice.channel.name + " ist nun nicht mehr abschließbar!");
    }
}
