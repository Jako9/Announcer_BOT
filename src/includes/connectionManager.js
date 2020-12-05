const jsonParser = require('./jsonParser.js');
const serverManager = require('./serverManager.js');

//Sound Files
const PATH = "/home/max/Dokumente/Bastelordner/Announcer_BOT";
const SUFFIX = '.wav';
const LOGIN_SOUND = PATH + "/resources/default/default" + SUFFIX;

var vip = unMergeArrays(jsonParser.read(PATH + "/config/vips.json").vips);

//Gibt wieder, ob die Person ein VIP ist
function isVip(userID){
    vip = unMergeArrays(jsonParser.read(PATH + "/config/vips.json").vips);
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

function unMergeArrays(a){
  let merged = [];
  for (i = 0; i < a.length; i++) {
      merged.push(a[i][0]);
  }

  return merged;
}


module.exports = {
    triggerJoin: function(oldState, newState, rolle){
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
            file = PATH + "/resources/vips/"+ newState.member.id + SUFFIX;

            rdm = Math.floor(Math.random() * 61) + 1; //Never gonna give you up, never gonna let you down.....

            if(rdm == 5){
              file = PATH + "/resources/default/rickroll" + SUFFIX;
            }

            newUserChannel.join().then(connection => bot_join(newUserChannel, connection, file ));
            return;
          }

          //Der Server hat keine Rolle festgelegt
          if(!rolle) return;

          //Hat der Nutzer die passende Rolle?
          let role = newState.guild.roles.cache.find(role => role.name === rolle);
          //Nicht interessant
          if(!newState.member.roles.cache.has(role.id)) return;

          //Bot soll joinen
          serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
          newUserChannel.join().then(connection => bot_join(newUserChannel, connection, LOGIN_SOUND));
          return;
        }
        //Es handelt sich um ein Verlassen
        else if((oldUserChannel !== undefined) && (newUserChannel === undefined)){

        }
    },

    triggerLeave: function(message){
        leave(message);
    }
}
