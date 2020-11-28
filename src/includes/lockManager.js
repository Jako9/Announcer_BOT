var whoLocked;

//ABschließen
var channelSize = 0;

//Schließ einen abgeschlossenen Raum (Channel) wieder auf
function lockChannel (member){
    channelSize = member.voice.channel.userLimit;
    whoLocked = member;
    member.voice.channel.setUserLimit(1);
}


//Schließt einen Raum (Channel) ab
function unlockChannel(voiceChannel){
    whoLocked = null;
    voiceChannel.setUserLimit(channelSize);
}

module.exports = {
    lock: function (message){
        if(!message.member.voice.channel){
            message.reply('Du musst erst einem Channel beitreten, der abgeschlossen werden darf!');
            return;
          }
          if(whoLocked){
            message.reply('Es ist schon abgeschlossen.');
            return;
          }
          lockChannel(message.member);
          message.reply('Abgeschlossen');
    },
    
    
    unlock: function(message){
        if(!whoLocked){
            message.reply('Es ist nichts abgeschlossen!');
            return;
        }
        if(message.member != whoLocked){
            message.reply('Du hast nicht abgeschlossen!');
            return;
        }
        unlockChannel(message.member.voice.channel);
        message.reply('Aufgeschlossen');
    },
}
  
  
