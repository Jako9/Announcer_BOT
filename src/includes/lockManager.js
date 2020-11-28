const serverManager = require('./serverManager.js');

//Schließ einen abgeschlossenen Raum (Channel) wieder auf
function lockChannel (member){
    console.log("Übergebene ID: " + member.voice.channel.userLimit);
    serverManager.setChannelSize(member.voice.channel.guild.id, member.voice.channel.userLimit);
    serverManager.setWhoLocked(member.voice.channel.guild.id,member.id);
    member.voice.channel.setUserLimit(1);
}


//Schließt einen Raum (Channel) ab
function unlockChannel(voiceChannel){
    serverManager.setWhoLocked(voiceChannel.guild.id, null);
    voiceChannel.setUserLimit(serverManager.getChannelSize(voiceChannel.guild.id));
    console.log(serverManager.getChannelSize(voiceChannel.guild.id));
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
            message.reply('Du hast nicht abgeschlossen!');
            return;
        }
        unlockChannel(message.member.voice.channel);
        message.reply('Aufgeschlossen');
    },
}
  
  
