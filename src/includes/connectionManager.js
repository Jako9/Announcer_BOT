const jsonParser = require('./jsonParser.js');
const serverManager = require('./serverManager.js');
const _path = require('path');

//Sound Files
const SUFFIX = '.wav';
const LOGIN_SOUND =_path.resolve('./resources/default/Avengers_Suite' + SUFFIX);

var vip = jsonParser.read(_path.resolve('./config/vips.json')).vips;

//Gibt wieder, ob die Person ein VIP ist
function isVip(userID){
    for(i = 0; i < vip.length; i++){
        if(vip[i] == userID){
            return true;
        }
    }
        return false;
}

// Ton spielen wenn bereit und danach den Channel wieder verlassen
function bot_join(vc, connection, file){
    const dispatcher = connection.play(file);
    dispatcher.setVolume(serverManager.getVolume(vc.guild.id));
    dispatcher.on("finish", end => leave(vc));
}

// Bot Server verlassen
function leave(guildFeeder){
    if(guildFeeder.guild.members.cache.find(member => member.id === guildFeeder.guild.me.id).voice.channel != null){
        guildFeeder.guild.members.cache.find(member => member.id === guildFeeder.guild.me.id).voice.channel.leave();
    }
}

module.exports = {
    triggerJoin: function(oldState, newState, rollen){
        let newUserChannel = newState.channel;
        let oldUserChannel = oldState == null ? undefined : oldState.channel;

        //Es handelt sich um einen Beitritt
        if((oldUserChannel == undefined) && (newUserChannel != undefined)){
            if((Date.now() - serverManager.getTimeLastJoin(newUserChannel.guild.id)) > 20000) {
                for(var i = 0;  i < rollen.length; i++){
                    let role = newState.guild.roles.cache.find(role => role.name === rollen[i]);
                    if(role != null && !newState.member.bot){
                        //Rolle spricht den Bot an oder Nutzer ist VIP
                        if(newState.member.roles.cache.has(role.id) && !isVip(newState.member.id)) {
                            serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
                            newUserChannel.join().then(connection => bot_join(newUserChannel, connection, LOGIN_SOUND));
                            break;
                        }
                    }
                }
                //Prüft, ob der Member  ein  VIP ist und somit seinen eigenen Sound  bekommt
                if(isVip(newState.member.id)){
                    serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
                    newUserChannel.join().then(connection => bot_join(newUserChannel, connection, _path.resolve('./resources/vips/'+ newState.member.id + SUFFIX)));
                }
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
