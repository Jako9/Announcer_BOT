const jsonParser = require('./jsonParser.js');
var https = require("https");
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";


module.exports = {
    becomeVIP: function(message){
      https.get('https://hook.integromat.com/rq89fjoouy985of9qg8tltpjgynnhj3a', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
      });
      http.createServer(function(request, response) {
        if( req.method === 'POST' ) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('Hello, World!\n');
        }
    }).listen(80);
    }
}
