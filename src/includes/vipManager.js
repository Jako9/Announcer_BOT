const jsonParser = require('./jsonParser.js');
var https = require("https");
const PATH = "/home/max/Dokumente/Bastelordner/Announcer_BOT";


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
          let transactions = jsonParser.read(PATH + "/config/pendingpayments.json").transactions;
          let transID = jsonData.transID;
          let userID = message.author.id;
          transactions.add({
            "transID" : transID,
            "userID" : userID,
            "status" : "Pending"
          });
          jsonParser.write(PATH + "/config/pendingpayments.json", transactions);
          message.reply(link);
        }else{
          message.reply("Fehler bei der Transaktion, bitte versuche es erneut!");
        }
      
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
}