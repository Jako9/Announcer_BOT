const jsonParser = require('./jsonParser.js');
const logManager = require('./logManager.js');
const dbManager = require('./databaseManager.js');

const fs = require('fs');
let https = require("https");
let axios = require('axios');

let mp3Duration = require('mp3-duration');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

function buildEmbed(link){
  let hyperlink = '[here](' + link + ' \"become VIP\")';
  let embed = {
    color: 0x161616,
    title: 'Become a VIP',
    url: link,
    author: {
  		name: 'Announcer_BOT',
  		icon_url: 'https://cdn.discordapp.com/avatars/541676543525519360/f7ee86514955577f12f1a9aca6001371.png?size=256',
  		url: 'http://announcer.jmk.cloud'
  	},
    description: 'You want to become a VIP? \n Just follow the instructions and you will have a custom joinsound in no time!',
    thumbnail: {
  		url: 'https://cdn.discordapp.com/avatars/541676543525519360/f7ee86514955577f12f1a9aca6001371.png?size=256'
  	},
    fields: [
  		{
  			name: 'How do I become a VIP?',
  			value: 'Just click ' + hyperlink + ' and follow the instructions. After you are done, you can send a .mp3 file (max length 8 sec.) to the bot and your custom joinsound is ready!'
  		},
      {
        name: '\u200B',
        value: '\u200B'
      }
  	],
    image: {
  		url: 'https://www.paypalobjects.com/webstatic/icon/pp258.png'
  	}
  };
  return embed;
}

function changeVIPSound(message, file){
  //File zu groß
  if(file.size > (1024 * 700)){
    message.author.send("The file is too big. The maximum filesize must be at most 700kb").catch(err => {logManager.writeErrorLog(err.stack);});
    return;
  }

  axios.request({
    responseType: 'arraybuffer',
    url: file.proxyURL,
    method: 'get',
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  }).then((result) => {
    const outputFilename = "/announcer/resources/.cache/" + message.author.id + ".mp3";
    fs.writeFileSync(outputFilename, result.data);
    const pathToCheck = outputFilename;

    let failed = false;
    logManager.writeDebugLog("Die File im Cache liegt im Pfad: " + pathToCheck);
    mp3Duration(pathToCheck, function (err, duration) {
      if(err){
        message.author.send("Something went wrong...").catch(err => {logManager.writeErrorLog(err.stack);});
        failed = true;
      }

      logManager.writeDebugLog("Die duration ist: " + duration);

      if(duration > 8){
        message.author.send("The duration of the joinsound has to be less then 8 seconds.").catch(err => {logManager.writeErrorLog(err.stack);});
        failed = true;
      }
      //File valid, trage den VIP sound ein

      if(!failed){
        //copy ins zielverzeichnis
        jsonParser.copy(pathToCheck, "/announcer/resources/vips/" + message.author.id + ".mp3");

        //Füge VIP hinzu
        dbManager.getVip(message.author.id, function(vip){
          if(vip){
            message.author.send("Your joinsound has been updated successfully!").catch(err => {logManager.writeErrorLog(err.stack);});
          }
          else{
            message.author.send("Hey you have received the VIP-Status! :D Your joinsound has been uploaded successfully.").catch(err => {logManager.writeErrorLog(err.stack);});
            dbManager.setVip(message.author, function(worked){});
            dbManager.deletePayment(message.author.id, function(worked){});
          }
        });
      }
    jsonParser.delete(pathToCheck);
    });


    }).catch(err => {
      message.author.send("Your submitted file is not a valid mp3. Please try again!").catch(err => {logManager.writeErrorLog(err.stack);});
    });
}

function unMergeArrays(a){
  let merged = [];
  for (i = 0; i < a.length; i++) {
      merged.push(a[i][0]);
  }

  return merged;
}

module.exports = {
    becomeVIP: function(message){
      dbManager.getVip(message.author.id, function(is){
        if(is){
          message.author.send("You are already VIP!").catch(err => {logManager.writeErrorLog(err.stack);});
        }else{
          dbManager.getUserPayment(message.author.id,function(exists){
            if(exists){
              dbManager.getPaymentLink(message.author.id, function(link){
                let embed = buildEmbed(link);
                message.author.send({ embed: embed}).catch(err => {logManager.writeErrorLog(err.stack);});
                if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.").catch(err => {logManager.writeErrorLog(err.stack);});
              });
            }
            else{
              dbManager.getAPISpecs('createPayment', function(createPaymentObject){
                logManager.writeDebugLog(createPaymentObject.link + "?pass=" + createPaymentObject.password);

                https.get(createPaymentObject.link + "?pass=" + createPaymentObject.password, (resp) => {
                let data = '';

                //Antwort
                resp.on('data', (chunk) => {
                  data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                  let link = null
                  let breakOut = false
                  try{
                    let jsonData = JSON.parse(data);
                    link = jsonData.paypalLink;
                  }
                  catch(e){
                    logManager.writeErrorLog(e);
                    logManager.writeErrorLog(data);
                    breakOut = true;
                  }
                  if(link && !breakOut){
                    dbManager.createPendingPayment(jsonData.transID,message.author.id,link,"Pending",function(worked){});
                    let embed = buildEmbed(link);
                    message.author.send({ embed: embed}).catch(err => {logManager.writeErrorLog(err.stack);});
                    if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.").catch(err => {logManager.writeErrorLog(err.stack);});

                  }else{
                    message.author.send("Transaction failure, please try again!").catch(err => {logManager.writeErrorLog(err.stack);});
                  }
                }).on("error", (err) => {
                  console.log("Error: " + err.message);
                });
              })
            });
          }
        });
        }
      })
  },

  fileReceived: function(message, file){

    dbManager.getVip(message.author.id, function(vip){
      if(vip){
        //Der Nutzer ist ein VIP => Er ändert seinen Joinsound
        changeVIPSound(message, file);
      }
      else{
        //Der Nutzer hat eine Bezahlung am laufen (erledigt oder nicht)
        dbManager.getPaymentStatus(message.author.id, function(status){
          if(!status){
            //Der Nutzer hat noch keinen Antrag auf VIP-Status gestellt
            message.author.send("You are no vip YET! Type \"becomeVIP\" to become a vip.").catch(err => {logManager.writeErrorLog(err.stack);});
          }
          //Zahlung noch nicht erfolgt
          else if(status == "Pending"){
            message.author.send("Your payment has not been received yet. If you think you have already paid, please contact @Jako9#4446 on discord or write an email to announcer.backend@gmail.com.").catch(err => {logManager.writeErrorLog(err.stack);});
          }
          //Zahlung erfolgreich
          else if(status == "approved"){
            changeVIPSound(message, file);
          }
          //Das sollte nicht passieren
          else{
            message.author.send("Something went horribly wrong and this should not have happened. Please contact @Jako9#4446 on discord or write an email to announcer.backend@gmail.com.").catch(err => {logManager.writeErrorLog(err.stack);});
          }
        });
      }
    });
  }
}
