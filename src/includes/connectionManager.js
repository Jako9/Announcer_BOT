
const volume = 0.2;
//Sound Files
const login_sound = '/var/www/git.jmk.cloud/html/Announcer_BOT/Avengers_Suite.wav';

var timeLastJoin = 0;

//Gibt wieder, ob die Person ein VIP ist
function isVip(userID, vip){
    for(i = 0; i < vip.length; i++){
        if(vip[i][0] == userID){
            return [true, vip[i][1]];
        }
    }
        return [false];
}

// Ton spielen wenn bereit und danach den Channel wieder verlassen
function bot_join(vc, connection, file){
    const dispatcher = connection.play(file);
    dispatcher.setVolume(volume);
    dispatcher.on("finish", end => leave(vc));
}

// Bot Server verlassen
function leave(guildFeeder){
    if(guildFeeder.guild.members.cache.find(member => member.id === guildFeeder.guild.me.id).voice.channel != null){
        guildFeeder.guild.members.cache.find(member => member.id === guildFeeder.guild.me.id).voice.channel.leave();
    }
}

module.exports = {
    triggerJoin: function(oldState, newState, rollen, vip){
        let newUserChannel = newState.channel;
        console.log(newState);
        let oldUserChannel = oldState == null ? undefined : oldState.channel;
    
        //Es handelt sich um einen Beitritt
        if((oldUserChannel == undefined) && (newUserChannel != undefined)){
            if((Date.now() - timeLastJoin) > 20000) {
                for(var i = 0;  i < rollen.length; i++){
                    let role = newState.guild.roles.cache.find(role => role.name === rollen[i]);
                    if(role != null && !newState.member.bot){
                        //Rolle spricht den Bot an oder Nutzer ist VIP
                        if(newState.member.roles.cache.has(role.id) && !isVip(newState.member.id, vip)[0]) {
                            timeLastJoin = Date.now();
                            newUserChannel.join().then(connection => bot_join(newUserChannel, connection, login_sound));
                            break;
                        }
                    }
                }
                //Prüft, ob der Member  ein  VIP ist und somit seinen eigenen Sound  bekommt
                if(isVip(newState.member.id, vip)[0]){
                    timeLastJoin = Date.now();
                    newUserChannel.join().then(connection => bot_join(newUserChannel, connection, isVip(newState.member.id, vip)[1]));
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