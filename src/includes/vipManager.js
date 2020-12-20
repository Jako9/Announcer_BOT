const jsonParser = require('./jsonParser.js');
const logManager = require('./logManager.js');
const dbManager = require('./databaseManager.js');

const fs = require('fs');
let https = require("https");
let axios = require('axios');

let mp3Duration = require('mp3-duration');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

const webApi = jsonParser.read(PATH + "/config/api.json");

function buildEmbed(link){
  let hyperlink = '[here](' + link + ' \"become VIP\")';
  let embed = {
    color: 0x0099ff,
    title: 'Become a VIP',
    url: link,
    author: {
  		name: 'Announcer_BOT',
  		icon_url: 'https://i.imgur.com/wSTFkRM.png',
  		url: 'http://announcer.jmk.cloud'
  	},
    description: 'You want to become a VIP? \n Just follow the instructions and you will have a custom joinsound in no time!',
    thumbnail: {
  		url: 'https://i.imgur.com/wSTFkRM.png'
  	},
    fields: [
  		{
  			name: 'How do I become a VIP?',
  			value: 'Just click ' + hyperlink + ' and follow the instructions. After you are done, you can send a .wav file (max length 8 sec.) to the bot and your custom joinsound is ready!'
  		},
      {
        name: '\u200B',
        value: '\u200B'
      }
  	],
    image: {
  		url: 'https://www.paypalobjects.com/webstatic/icon/pp258.png'
  	},
    timestamp: new Date(),
    footer: {
  		text: 'Some footer text here',
  		icon_url: 'https://i.imgur.com/wSTFkRM.png'
  	}
  };
  return embed;
}

function changeVIPSound(message, file){
  //File zu groß
  if(file.size > (1024 * 700)){
    message.author.send("The file is too big. The maximum filesize must be at most 700kb");
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
    const outputFilename = PATH + "/resources/.cache/" + message.author.id + ".mp3";
    fs.writeFileSync(outputFilename, result.data);
    const pathToCheck = outputFilename;

    let failed = false;
    logManager.writeDebugLog("Die File im Cache liegt im Pfad: " + pathToCheck);
    mp3Duration(pathToCheck, function (err, duration) {
      if(err){
        message.author.send("1: Your submitted file is not a valid mp3. Please try again!");
        failed = true;
      }

      logManager.writeDebugLog("Die duration ist: " + duration);

      if(duration > 8){
        message.author.send("The duration of the joinsound has to be less then 8 seconds.");
        failed = true;
      }
      //File valid, trage den VIP sound ein

      if(!failed){
        //copy ins zielverzeichnis
        jsonParser.copy(pathToCheck, PATH + "/resources/vips/" + message.author.id + ".mp3");

        //Füge VIP hinzu
        dbManager.getVip(message.author.id, function(vip){
          if(vip){
            message.author.send("Your joinsound has been updated successfully!");
          }
          else{
            message.author.send("Hey you have recieved the VIP-Status! :D Your joinsound has been uploaded successfully.");
            dbManager.setVip(message.author.id, function(worked){});
            dbManager.deletePayment(message.author.id, function(worked){});
          }
        });
      }
    jsonParser.delete(pathToCheck);
    });


    }).catch(err => {
      message.author.send("2: Your submitted file is not a valid mp3. Please try again!");
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
          message.author.send("Du bist schon VIP!").catch();
        }else{
          dbManager.getUserPayment(message.author.id,function(exists){
            if(exists){
              dbManager.getPaymentLink(message.author.id, function(link){
                let embed = buildEmbed(link);
                message.author.send({ embed: embed}).catch();
                if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.");
              });
            }
            else{
              logManager.writeDebugLog(webApi.createPayment.link + "?pass=" + webApi.createPayment.password);
        
              https.get(webApi.createPayment.link + "?pass=" + webApi.createPayment.password, (resp) => {
              let data = '';
        
              //Antwort
              resp.on('data', (chunk) => {
                data += chunk;
              });
        
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                let jsonData = JSON.parse(data);
                let link = jsonData.paypalLink;
                if(link){
                  dbManager.createPendingPayment(jsonData.transID,message.author.id,link,"Pending",function(worked){});
                  let embed = buildEmbed(link);
                  message.author.send({ embed: embed}).catch();
                  if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.");
                
                }else{
                  message.author.send("Fehler bei der Transaktion, bitte versuche es erneut!");
                }
              }).on("error", (err) => {
                console.log("Error: " + err.message);
              });
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
            message.author.send("You are no vip YET! Type \"becomeVIP\" to become a vip.");
          }
          //Zahlung noch nicht erfolgt
          else if(status == "Pending"){
            message.author.send("Your payment has not been received yet. If you think you have already paid, please contact @Jako9#4446 on discord or write an email to announcer.backend@gmail.com.");
          }
          //Zahlung erfolgreich
          else if(status == "approved"){
            changeVIPSound(message, file);
          }
          //Das sollte nicht passieren
          else{
            message.author.reply("Something went horribly wrong and this should not have happened. Please contact @Jako9#4446 on discord or write an email to announcer.backend@gmail.com.");
          }
        });
      }
    });
  }
}
