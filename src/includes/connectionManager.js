const jsonParser = require('./jsonParser.js');
const serverManager = require('./serverManager.js');

//Sound Files
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";
const SUFFIX = '.wav';
const LOGIN_SOUND = PATH + "/resources/default/default" + SUFFIX);

var vip = jsonParser.read(PATH + "/config/vips.json").vips;

//Gibt wieder, ob die Person ein VIP ist
function isVip(userID){
    vip = jsonParser.read(PATH + "/config/vips.json").vips;
    let found = false;
    vip.forEach(vip => {
      if (vip == userID) found = true;
    });
    return found;
}

// Ton spielen wenn bereit und danach den Channel wieder verlassen
function bot_join(vc, connection, file){
    const dispatcher = connection.play(file);
    dispatcher.setVolume(serverManager.getVolume(vc.guild.id));
    dispatcher.on("finish", end => leave(vc));
}

// Bot Server verlassen
function leave(guildFeeder){
  let id = guildFeeder.guild.me.id;
  if(guildFeeder.guild.members.cache.find(member => member.id === id).voice.channel != null){
    guildFeeder.guild.members.cache.find(member => member.id === id).voice.channel.leave();
  }
}

module.exports = {
    triggerJoin: function(oldState, newState, rollen){
        let newUserChannel = newState.channel;
        let oldUserChannel = oldState.channel;
        //Member ist der Bot
        if(newState.member.bot) return;

        //Es handelt sich um einen Beitritt
        if((oldUserChannel == undefined) && (newUserChannel != undefined)){

          //Antispamschutz => Bot ist gerade erst gejoint
          if((Date.now() - serverManager.getTimeLastJoin(newUserChannel.guild.id)) < 20000) return;

          //Prüft, ob der Member  ein  VIP ist und somit seinen eigenen Sound  bekommt
          if(isVip(newState.member.id)){
            serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
            newUserChannel.join().then(connection => bot_join(newUserChannel, connection, PATH + "/resources/vips/"+ newState.member.id + SUFFIX)));
            return;
          }

          //Hat der Nutzer eine passende Rolle?
          for(var i = 0;  i < rollen.length; i++){
            let role = newState.guild.roles.cache.find(role => role.name === rollen[i]);
            //Nicht interessant
            if(!newState.member.roles.cache.has(role.id)) continue;

            //Bot soll joinen
            serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
            newUserChannel.join().then(connection => bot_join(newUserChannel, connection, LOGIN_SOUND));
            return;
          }
        }
        //Es handelt sich um ein Verlassen
        else if((oldUserChannel !== undefined) && (newUserChannel === undefined)){

        }
    },

    triggerLeave: function(message){
        leave(message);
    }
}
