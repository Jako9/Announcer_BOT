const jsonParser = require('./jsonParser.js');
var https = require("https");
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

function private(message){
  message.reply("Your dms are probably closed. Please open them and try again.");
}

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
          message.author.send(link).catch(err => message.reply(err));
        }else{
          message.author.send("Fehler bei der Transaktion, bitte versuche es erneut!").catch(message.reply("2Your dms are probably closed. Please open them and try again."));
        }

      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
}
