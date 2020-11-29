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
        message.reply('Du musst erst einem Channel beitreten, der abgeschlossen werden darf!');
        return;
      }
      if(serverManager.setWhoLocked(message.guild.id)){
        message.reply('Es ist schon abgeschlossen.');
        return;
      }
      lockChannel(message.member);
      message.reply('Abgeschlossen');
    },

    unlock: function(message){
      if(!serverManager.getWhoLocked(message.guild.id)){
        message.reply('Es ist nichts abgeschlossen!');
        return;
      }
      if(message.member != serverManager.getWhoLocked(message.guild.id)){
        message.reply('Es kann nur die Person aufschließen, die auch abgeschlossen hat!');
        return;
      }
      unlockChannel(message.member.voice.channel);
      message.reply('Aufgeschlossen');
    },
}
