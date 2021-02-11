const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

//Schließ einen abgeschlossenen Raum wieder auf
function lockChannel (message){
  let channel = message.member.voice.channel;
  let channels = serverManager.getLockedChannels(channel.guild.id);
  let members = [];
  channel.members.forEach(member => {
    members.push(member.id);
  });
  let lockedChannel = {"channel":channel,"whoLocked":message.member.id,"size":channel.userLimit,"members":members};
  channels.push(lockedChannel);
  serverManager.setLockedChannels(channel.guild.id, channels);
  channel.setUserLimit(message.member.voice.channel.members.size);
}

//Schließt einen Raum ab
async function unlockChannel(channel){
  let id = channel.channel.guild.id;

  //Channel ist gar nicht abgeschlossen
  if(!isLocked(channel)) return;
  let channelSize = channel.size;
  let newChannels = serverManager.getLockedChannels(id).filter(lockedChannel => {
    return lockedChannel.channel.id != channel.channel.id;
  });

  //Lösche Channel aus den abgeschlossenen Channels
  serverManager.setLockedChannels(channel.channel.guild.id, newChannels);
  await channel.channel.setUserLimit(channelSize);
}

function isLocked(channel){
  let channels = serverManager.getLockedChannels(channel.channel.guild.id);
  for(let i = 0; i < channels.length; i++){
    if(channels[i].channel.id == channel.channel.id) return true;
  }
  return false;
}

module.exports = {
    lock: function (message, prefix, instructions){
      //User in keinem Channel
      if(!message.member.voice.channel){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Der Benutzer sitzt in keinem Channel).");
        message.reply('You must first join a channel that is lockable!');
        return;
      }
      //Channel nicht abschließbar
      let ids = []
      serverManager.getLockable(message.guild.id).forEach(channel => {
        ids.push(channel.id);
      });
      if(!ids.includes(message.member.voice.channel.id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Der Channel ist nicht abschließbar).");
        message.reply('The current voicechannel is not lockable. For more info type: ' + prefix + instructions[8][0].name + " 2" + " or " + prefix + instructions[8][0].name + " 3");
        return;
      }
      let channels = serverManager.getLockedChannels(message.guild.id);
      let channel = channels.find(channel => {
        return channel.channel.id == message.member.voice.channel.id;
      });
      if(channel != undefined){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Dieser Channel ist schon abgeschlossen).");
        message.reply('This channel is locked already.');
        return;
      }
      lockChannel(message);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde abgeschlossen.");
      message.reply('The channel has been locked');
    },

    unlock: function(message){
      let id = message.guild.id;
      let channels = serverManager.getLockedChannels(id);
      let channel = channels.find(channel => {
        return channel.channel.id == message.member.voice.channel.id;
      });
      if(channel == undefined){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Channel ist nicht abgeschlossen).");
        message.reply('This channel is not locked!');
        return;
      }
      if(!channel.members.includes(message.member.id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Nutzer darf den Channel nicht aufschließen).");
        message.reply('You don\'t have the permission to unlock this channel! Only people who have been present while locking the channel may unlock it.');
        return;
      }
      unlockChannel(channel);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde aufgeschlossen.");
      message.reply('Unlocked!');
    },

    lockableClear: function(message){
      serverManager.setLockable(message.guild.id, []);
      logManager.writeDebugLog(message.guild.name + ": Die abzuschließenden Channel wurden zurückgesetzt.");
      message.reply("The lockable channels have been reset.");
    },

    showLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(channels.length == 0){
        message.reply("There are no channels, which may be locked.");
        return;
      }
      let msg = "```\n"
      channels.forEach(channel => msg += (channel.name + "\n"));
      msg += "```";
      message.reply(msg);
    },

    removeMember: function(member){
      let channels = serverManager.getLockedChannels(member.guild.id);
      channels.forEach(channel => {
        channel.members = channel.members.filter(lockMember => {
          return lockMember != member.id;
        });
      });

      serverManager.setLockedChannels(member.guild.id, channels);
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
        message.reply("Please enter the channel you want to be lockable.");
        return;
      }
      let ids = []
      channels.forEach(channel => {
        ids.push(channel.id);
      });
      if(ids.includes(message.member.voice.channel.id)){
        message.reply("This channel is lockable already.");
        return;
      }
      channels.push({"name":message.member.voice.channel.name, "id":message.member.voice.channel.id});
      serverManager.setLockable(message.guild.id, channels);
      message.reply(message.member.voice.channel.name + " is now lockable!");
    },

    removeLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(!message.member.voice.channel){
        message.reply("Please enter the channel you want to no longer be lockable.");
        return;
      }
      let ids = []
      serverManager.getLockable(message.guild.id).forEach(channel => {
        ids.push(channel.id);
      });
      if(!ids.includes(message.member.voice.channel.id)){
        message.reply("This channel is not lockable.");
        return;
      }
      let index = ids.indexOf(message.member.voice.channel.id);
      channels.splice(index, 1);
      serverManager.setLockable(message.guild.id, channels);
      message.reply(message.member.voice.channel.name + " is no longer lockable!");
    }
}
