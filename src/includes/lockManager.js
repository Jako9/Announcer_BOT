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
  channel.setUserLimit(message.member.voice.channel.members.size).catch(err => {logManager.writeErrorLog(err.stack);});
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
  try{
    await channel.channel.setUserLimit(channelSize);
  }
  catch(err){
    logManager.writeErrorLog(err.stack);
  }
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
        message.reply({content: 'You must first join a channel that is lockable!', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      //Channel nicht abschließbar
      let ids = []
      serverManager.getLockable(message.guild.id).forEach(channel => {
        ids.push(channel.id);
      });
      if(!ids.includes(message.member.voice.channel.id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Der Channel ist nicht abschließbar).");
        message.reply({content: 'The current voicechannel is not lockable. For more info type: ' + prefix + instructions[8][0].name + " 2" + " or " + prefix + instructions[8][0].name + " 3", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      let channels = serverManager.getLockedChannels(message.guild.id);
      let channel = channels.find(channel => {
        return channel.channel.id == message.member.voice.channel.id;
      });
      if(channel != undefined){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Dieser Channel ist schon abgeschlossen).");
        message.reply({content: 'This channel is locked already.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      lockChannel(message);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde abgeschlossen.");
      message.reply({content: 'The channel has been locked', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
    },

    unlock: function(message){
      let id = message.guild.id;
      let channels = serverManager.getLockedChannels(id);
      let channel = channels.find(channel => {
        return channel.channel.id == message.member.voice.channel.id;
      });
      if(channel == undefined){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Channel ist nicht abgeschlossen).");
        message.reply({content: 'This channel is not locked!', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      if(!channel.members.includes(message.member.id)){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht aufgeschlossen werden (Der Nutzer darf den Channel nicht aufschließen).");
        message.reply({content: 'You don\'t have the permission to unlock this channel! Only people who have been present while locking the channel may unlock it.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      unlockChannel(channel);
      logManager.writeDebugLog(message.guild.name + ": Der Channel wurde aufgeschlossen.");
      message.reply({content: 'Unlocked', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
    },

    lockableClear: function(message){
      serverManager.setLockable(message.guild.id, []);
      logManager.writeDebugLog(message.guild.name + ": Die abzuschließenden Channel wurden zurückgesetzt.");
      message.reply({content: "The lockable channels have been reset.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
    },

    showLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(channels.length == 0){
        message.reply({content: "There are no channels, which may be locked.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      let msg = "```\n"
      channels.forEach(channel => msg += (channel.name + "\n"));
      msg += "```";
      message.reply({content: msg, allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
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
      logManager.writeErrorLog(voiceState.guild.id);
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
        message.reply({content: "Please enter the channel you want to be lockable.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      let ids = []
      channels.forEach(channel => {
        ids.push(channel.id);
      });
      if(ids.includes(message.member.voice.channel.id)){
        message.reply({content: "This channel is lockable already.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      channels.push({"name":message.member.voice.channel.name, "id":message.member.voice.channel.id});
      serverManager.setLockable(message.guild.id, channels);
      message.reply({content: message.member.voice.channel.name + " is now lockable!", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
    },

    removeLockable: function(message){
      let channels = serverManager.getLockable(message.guild.id);
      if(!message.member.voice.channel){
        message.reply({content: "Please enter the channel you want to no longer be lockable.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      let ids = []
      serverManager.getLockable(message.guild.id).forEach(channel => {
        ids.push(channel.id);
      });
      if(!ids.includes(message.member.voice.channel.id)){
        message.reply({content: "This channel is not lockable.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      let index = ids.indexOf(message.member.voice.channel.id);
      channels.splice(index, 1);
      serverManager.setLockable(message.guild.id, channels);
      message.reply({content: message.member.voice.channel.name + " is no longer lockable!", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
    }
}
