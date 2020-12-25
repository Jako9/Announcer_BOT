const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

//Schließ einen abgeschlossenen Raum wieder auf
function lockChannel (message){
  let channel = message.member.voice.channel;
  let members = [];
  channel.members.forEach(member => {
    members.push(member.id);
  });
  let lockedChannels = {"channel":channel,"whoLocked":message.member.id,"size":channel.userLimit,"members":members};
  serverManager.setLockedChannels(channel.guild.id, serverManager.getLockedChannels(channel.guild.id).push(lockedChannel));
  channel.setUserLimit(message.member.voice.channel.members.size);
}

//Schließt einen Raum ab
async function unlockChannel(channel){
  let id = channel.guild.id;

  //Channel ist gar nicht abgeschlossen
  if(!isLocked(channel)) return;
  let channelSize = channel.size;

  //Lösche Channel aus den abgeschlossenen Channels
  serverManager.setLockedChannels(serverManager.getLockedChannels(id).filter(channel => {
    return channel.channel.id != channel.channel.id;
  }));
  await channel.setUserLimit(channelSize);
}

function isLocked(channel){
  let channels = serverManager.getLockedChannels(channel.guild.id);
  for(let i = 0; i < channels.length; i++){
    if(channels[i].channel.id == channel.id) return true;
  }
  return false;
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
      let channels = serverManager.getLockedChannels(message.guild.id);
      if(channels.find(channel => {
        channel.channel.id == message.member.voice.channel.id;
      }) != undefined){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Dieser Channel ist schon abgeschlossen).");
        message.reply('Dieser Channel ist schon abgeschlossen.');
        return;
      }
      lockChannel(message);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde abgeschlossen.");
      message.reply('Abgeschlossen');
    },

    unlock: function(message){
      let id = message.guild.id;
      let channels = serverManager.getLockedChannels(id);
      if(channels.find(channel => {
        channel.channel.id == message.member.voice.channel.id;
      }) == undefined){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Channel ist nicht abgeschlossen).");
        message.reply('Dieser Channel ist nicht abgeschlossen!');
        return;
      }
      let channel = channels.find(channel => {
        channel.channel.id == message.member.voice.channel.id;
      });
      if(!channel.members.includes(message.member.id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Nutzer darf den Channel nicht aufschließen).");
        message.reply('Du darfst den Channel nicht aufschließen! Es dürfen nur Personen aufschließen, die bei dem abschließen dabei waren.');
        return;
      }
      logManager.writeDebugLog("Channel = " + message.member.voice.channel);
      unlockChannel(channel);
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
        message.reply("Es gibt keine Channel, die abgeschlossen werden dürfen.");
        return;
      }
      let msg = "```\n"
      channels.forEach(channel => msg += (channel.name + "\n"));
      msg += "```";
      message.reply(msg);
    },

    removeMember: function(member){
      let channels = serverManager.getLockable(member.guild.id);
      channels.forEach(channel => {
        channel.members = channel.members.filter(lockMember => {
          lockMember != member.id;
        });
      });

      serverManager.setLockedChannels(member.id, channels);
    },

    forceUnlock: function(voiceState){
      let channels = serverManager.getLockedChannels(voiceState.guild.id);
      channels.forEach(channel => {
        if(channel.whoLocked == voiceState.member.id) unlockChannel(channel);
      });
    },

    crashUnlock: async function(id){
      let channels = serverManager.getLockedChannels(id);
      for(let i = 0; i < channels.length; i++){
        await unlockChannel(channels[i]);
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
      if(ids.includes(message.member.voice.channel.id)){
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
