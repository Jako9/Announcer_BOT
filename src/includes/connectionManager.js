const jsonParser = require('./jsonParser.js');
const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');
const statisticsManager = require('./statisticsManager.js');
const dbManager = require('./databaseManager.js');

//Sound Files
const SUFFIX = '.mp3';
const PROBAILITY = 65;


//Gibt wieder, ob die Person ein VIP ist
function isVip(userID, callback){
  dbManager.getVip(userID, function(out){
    if(out){
      if(out == 1){
        callback(true);
      }else{
        callback(false);
      }
    }else{
      callback(false);
    }
  });
}

function isInteger(string){
  if(string === undefined || string === null || string.length > 15) return false;
  for(let i = 0; i < string.length; i++){
    if(!['0','1','2','3','4','5','6','7','8','9'].includes(string.charAt(i))){
      return false;
    }
  }
  return true;
}

// Ton spielen wenn bereit und danach den Channel wieder verlassen
function bot_join(vc, connection, file){
  logManager.writeDebugLog(vc.guild.name + ": Bot soll dem Server betreten. " + "File = " + file);
    rdm = Math.floor(Math.random() * PROBAILITY) + 1; //Never gonna give you up, never gonna let you down.....
    if(rdm == 5){
      statisticsManager.rickroll();
      logManager.writeDebugLog(vc.guild.name + ": Rickroll wurde aktiviert.");
      file = "/announcer/resources/default/rickroll" + SUFFIX;
    }else{
      let today = new Date();

      if(today.getMonth() == 11){
        if(today.getDate() == 24 || today.getDate() == 25 || today.getDate() == 26){
          logManager.writeDebugLog(vc.guild.name + ": Es ist Weihnachten meine Kerle.");
          file = "/announcer/resources/default/christmas" + SUFFIX;
        }
      }
    }

    const dispatcher = connection.play(file);
    statisticsManager.joined();
    dispatcher.setVolume(serverManager.getVolume(vc.guild.id));
    dispatcher.on("finish", end => {
      statisticsManager.addToPlaytime(dispatcher.streamTime);
      leave(vc);
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bot Server verlassen
async function leave(guildFeeder){
  let id = guildFeeder.guild.me.id;
  await sleep(500);
  if(guildFeeder.guild.members.cache.find((key, member) => member.id === id).voice.channel != null){
    guildFeeder.guild.members.cache.find((key, member) => member.id === id).voice.channel.leave();
  }
  logManager.writeDebugLog(guildFeeder.guild.name + ": Bot soll den Server verlassen.");
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

          isVip(newState.member.id, function(out){
            if(out){
              serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
              file = "/announcer/resources/vips/"+ newState.member.id + SUFFIX;
              newUserChannel.join().then(connection => bot_join(newUserChannel, connection, file)).catch(err => {logManager.writeErrorLog(err.stack);});
            }else{
              dbManager.getJoinsound(newState.member.id, function(out){
                if(out === false){
                }
                else{
                  serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
                  newUserChannel.join().then(connection => bot_join(newUserChannel, connection, "/announcer/resources/default/" + out + SUFFIX)).catch(err => {logManager.writeErrorLog(err.stack);});
                }
              });
            }
          });

          return;
        }
        //Es handelt sich um ein Verlassen
        else if((oldUserChannel !== undefined) && (newUserChannel === undefined)){

        }
    },

    triggerLeave: function(message){
        leave(message);
    },

    play: function(message, prefix, instructions){
      let channel = message.member.voice.channel;
      if(!channel){
        message.reply({content: "Please enter a channel first.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      if(message.content.split(' ').length != 2 || isNaN(message.content.split(' ')[1]) || message.content.split(' ')[1] <0 || message.content.split(' ')[1] > 9 || !isInteger(message.content.split(' ')[1])) {
        message.reply({content: 'Incorrect usage of \'' + prefix +  instructions[0][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      let sound = message.content.split(' ')[1];
      channel.join().then(connection => bot_join(channel, connection, "/announcer/resources/default/" + sound + SUFFIX)).catch(err => {logManager.writeErrorLog(err.stack);});
    },

    setJoinSound: function(message, prefix, instructions){
      isVip(message.member.id, function(is){
        if(is){
          message.reply({content: "You are a VIP! If you want a different joinsound, just send the file as a dm.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        }else{
          if(message.content.split(' ').length != 2 || isNaN(message.content.split(' ')[1]) || message.content.split(' ')[1] <0 || message.content.split(' ')[1] > 9 || !isInteger(message.content.split(' ')[1])) {
            message.reply({content: 'Incorrect usage of \'' + prefix +  instructions[1][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
          }
          else{
            dbManager.getUser(message.author.id, function(user){
              if(!user){
                dbManager.addUser(message.author.id, message.author.username, message.author.avatarURL(), message.content.split(' ')[1], function(successfull){
                  if(successfull){
                    message.reply({content: "The bot will now acompany you.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
                  }
                  else{
                    message.reply({content: "Something went wrong!", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
                  }
                });
              }
              else{
                dbManager.setJoinsound(message.author.id,message.content.split(' ')[1], function(successfull){
                  if(successfull){
                    message.reply({content: "Your joinsound has been updated successfully", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
                  }
                  else{
                    message.reply({content: "Something went wrong!", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
                  }

                });
              }
            });
          }

        }
      })
    },

    removeJoinSound: function(message){
      isVip(message.member.id, function(is){
        if(is){
          message.reply("You are a VIP! If you want a different joinsound, just send the file as a dm.").catch(err => {logManager.writeErrorLog(err.stack);});
        }else{
          dbManager.removeUser(message.member.id, function(succ){
            if(succ){
              message.reply("The bot will now no longer acompany you :(").catch(err => {logManager.writeErrorLog(err.stack);});
            }
            else{
              message.reply("Something went wrong!").catch(err => {logManager.writeErrorLog(err.stack);});
            }
          });

        }
      });
    }
}
