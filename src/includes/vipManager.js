const jsonParser = require('./jsonParser.js');
var https = require("https");
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

module.exports = {
    becomeVIP: function(message){
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
            "status" : "Pending"
          });
          transactions.transactions = transaction;
          jsonParser.write(PATH + "/config/pendingPayments.json", transactions);
          message.author.send(link).catch();
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
    const exampleEmbed = discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Become a VIP')
	.setURL('https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-17V25142MM4028412')
	.setAuthor('Announcer_BOT', 'https://i.imgur.com/wSTFkRM.png', 'http://announcer.jmk.cloud')
	.setDescription('You want to become a VIP? \n Just follow the instructions and you will have a custom joinsound in no time!')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addFields(
		{ name: 'How do I become a VIP?', value: 'Just click on the paypal link below and follow the instructions. After you are done, you can send a .wav file (max length 8 sec.) to the bot and your custom joinsound is ready!' },
		{ name: '\u200B', value: '\u200B' },

	)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
    message.author.send(exampleEmbed).catch();
    if(message.guild) message.reply("Check your dms ;). If they are empty, your dms are probably closed. In this case open them and try again.");
    }
}
