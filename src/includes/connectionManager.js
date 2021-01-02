const jsonParser = require('./jsonParser.js');
const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');
const statisticsManager = require('./statisticsManager.js');
const dbManager = require('./databaseManager.js');

//Sound Files
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";
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
  if(string === undefined || string === null) return false;
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
      file = PATH + "/resources/default/rickroll" + SUFFIX;
    }else{
      let today = new Date();

      if(today.getMonth() == 11){
        if(today.getDate() == 24 || today.getDate() == 25 || today.getDate() == 26){
          logManager.writeDebugLog(vc.guild.name + ": Es ist Weihnachten meine Kerle.");
          file = PATH + "/resources/default/christmas" + SUFFIX;
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

// Bot Server verlassen
function leave(guildFeeder){
  let id = guildFeeder.guild.me.id;
  if(guildFeeder.guild.members.cache.find(member => member.id === id).voice.channel != null){
    guildFeeder.guild.members.cache.find(member => member.id === id).voice.channel.leave();
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
              file = PATH + "/resources/vips/"+ newState.member.id + SUFFIX;
              newUserChannel.join().then(connection => bot_join(newUserChannel, connection, file));
            }else{
              dbManager.getJoinsound(newState.member.id, function(out){
                if(out === false){
                }
                else{
                  serverManager.setTimeLastJoin(newUserChannel.guild.id, Date.now());
                  newUserChannel.join().then(connection => bot_join(newUserChannel, connection, PATH + "/resources/default/" + out + ".mp3"));
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
        message.reply("Please enter a channel first.");
        return;
      }
      if(message.content.split(' ').length != 2 || isNaN(message.content.split(' ')[1]) || message.content.split(' ')[1] <0 || message.content.split(' ')[1] > 9 || !isInteger(message.content.split(' ')[1])) {
        message.reply('Incorrect usage of \'' + prefix +  instructions[0][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.');
        return;
      }
      let sound = message.content.split(' ')[1];
      channel.join().then(connection => bot_join(channel, connection, PATH + "/resources/default/" + sound + SUFFIX));
    },

    setJoinSound: function(message, prefix, instructions){
      isVip(message.member.id, function(is){
        if(is){
          message.reply("You are a VIP! If you want a different joinsound, just send the file as a dm.");
        }else{
          if(message.content.split(' ').length != 2 || isNaN(message.content.split(' ')[1]) || message.content.split(' ')[1] <0 || message.content.split(' ')[1] > 9 || !isInteger(message.content.split(' ')[1])) {
            message.reply('Incorrect usage of \'' + prefix +  instructions[1][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.');
          }
          else{
            dbManager.getUser(message.author.id, function(user){
              if(!user){
                dbManager.addUser(message.author.id, message.author.username, message.author.avatarURL(), message.content.split(' ')[1], function(successfull){
                  if(successfull){
                    message.reply("The bot will now acompany you.");
                  }
                  else{
                    message.reply("Something went wrong!");
                  }
                });
              }
              else{
                dbManager.setJoinsound(message.author.id,message.content.split(' ')[1], function(successfull){
                  if(successfull){
                    message.reply("Your joinsound has been updated successfully");
                  }
                  else{
                    message.reply("Something went wrong!");
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
          message.reply("You are a VIP! If you want a different joinsound, just send the file as a dm.");
        }else{
          dbManager.removeUser(message.member.id, function(succ){
            if(succ){
              message.reply("The bot will now no longer acompany you :(");
            }
            else{
              message.reply("Something went wrong!");
            }
          });

        }
      });
    }
}
