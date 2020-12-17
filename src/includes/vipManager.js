const jsonParser = require('./jsonParser.js');
var https = require("https");
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

function buildEmbed(link){
  let hyperlink = '[here](https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-17V25142MM4028412 \"become VIP\")';
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

function unMergeArrays(a){
  let merged = [];
  for (i = 0; i < a.length; i++) {
      merged.push(a[i][0]);
  }

  return merged;
}

function isPending(userID){
  pending = jsonParser.read(PATH + "/config/pendingPayments.json").transactions;
  let found = false;
  transactions.forEach(transaction => {
    if (transaction.userID == userID) found = true;
  });
  return found;
}

function isVip(userID){
    vip = unMergeArrays(jsonParser.read(PATH + "/config/vips.json").vips);
    let found = false;
    vip.forEach(vip => {
      if (vip == userID) found = true;
    });
    return found;
}

function getLink(userID){
  pending = jsonParser.read(PATH + "/config/pendingPayments.json").transactions;
  let link = "";
  transactions.forEach(transaction => {
    if (transaction.userID == userID) found = transaction.link;
  });
  return link;
}

module.exports = {
    becomeVIP: function(message){
      if(isVip(message.author.userID)){
        message.author.send("Du bist schon VIP!").catch();
        return;
      }
      if(isPending(message.author.userID)){
        let link = getLink(userID);
        let embed = buildEmbed(link);
        message.author.send({ embed: embed}).catch();
        if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.");
        return;
      }
      https.get('https://hook.integromat.com/rq89fjoouy985of9qg8tltpjgynnhj3a', (resp) => {
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
          let transactions = jsonParser.read(PATH + "/config/pendingPayments.json");
          let transaction = transactions.transactions;
          let transID = jsonData.transID;
          let userID = message.author.id;
          transaction.push({
            "transID" : transID,
            "userID" : userID,
            "link" : link,
            "status" : "Pending"
          });
          transactions.transactions = transaction;
          jsonParser.write(PATH + "/config/pendingPayments.json", transactions);
          let embed = buildEmbed(link);
          message.author.send({ embed: embed}).catch();
          if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.");
        }else{
          message.author.send("Fehler bei der Transaktion, bitte versuche es erneut!");
        }

      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  },

  becomeVIPTest: function(message){
    let exampleEmbed = buildEmbed("https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-17V25142MM4028412");
    message.author.send({ embed: exampleEmbed}).catch();
    if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.");
    }
}
