

//Sound Files
const PATH = '/var/www/git.jmk.cloud/html/Announcer_BOT/';
const SUFFIX = '.wav';
const login_sound = PATH + 'resources/default/Avengers_Suite' + SUFFIX;
const VOLUME = 0.2;

var timeLastJoin = 0;


var vip = [
    "278573049287278592",
    "244563226711293953",
    "406618328061181952",
    "235170831095955466",
    "229322210072985601",
    "174558221535674369",
    "346743271738966018",
    "212605029612257290",
    "210855895696015361",
    "421803620858724363",
    "224281303967727616"
];

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
    dispatcher.setVolume(VOLUME);
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
            if((Date.now() - timeLastJoin) > 20000) {
                for(var i = 0;  i < rollen.length; i++){
                    let role = newState.guild.roles.cache.find(role => role.name === rollen[i]);
                    if(role != null && !newState.member.bot){
                        //Rolle spricht den Bot an oder Nutzer ist VIP
                        if(newState.member.roles.cache.has(role.id) && !isVip(newState.member.id)) {
                            timeLastJoin = Date.now();
                            newUserChannel.join().then(connection => bot_join(newUserChannel, connection, login_sound));
                            break;
                        }
                    }
                }
                //Prüft, ob der Member  ein  VIP ist und somit seinen eigenen Sound  bekommt
                if(isVip(newState.member.id)){
                    timeLastJoin = Date.now();
                    newUserChannel.join().then(connection => bot_join(newUserChannel, connection, PATH + 'resources/vips/'+ newState.member.id + SUFFIX));
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
