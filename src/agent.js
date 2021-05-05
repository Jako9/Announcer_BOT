const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express')
const { spawn } = require('child_process');
const { type } = require('os');
let announcer = {};

const privateKey = fs.readFileSync('/https/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/https/cert.pem', 'utf8');
const ca = fs.readFileSync('/https/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

//erstelle den Webserver
const app = express()
//Webserver läuft auf Port 3000
const port = 3000

announcer = spawn('node', ['/announcer/code/announcer.js']);

//Route um den Status der Nodeapplikation zu liefern
app.get('/status', function (req, res) {
    let running = 0;
    if(announcer.pid){
        running = 1;
    }
    res.send({"running": running});
});

//Startet die Nodeapplikation
app.post('/start', function (req, res) {
    //Erstelle einen Childprocess mit einer Nodeapp die den Bot startet
    announcer = spawn('node', ['/announcer/code/announcer.js']);
    res.send({"pid": announcer.pid});
});

//Beendet die Nodeapplikation
app.post('/kill', function (req, res) {
    //Schickt an den Bot-Childprocess ein Sigterm um ihm zu beenden
    if(typeof(announcer) != 'undefined' && Object.entries(announcer).length !== 0){
        announcer.kill('SIGTERM');
        announcer = {};
        res.send({"pid": announcer.pid});
    }else{
        res.send({});
    }
});

//Behilfsmethode um die Logdateien aus dem Webinterface heraus löschen zu können
app.post('/log/clear/:log', function (req, res) {

    let deletePath = "";
    

    switch(req.params.log){
        case "boot":
            deletePath = "/announcer/logs/boot_log.log";
            break;
        case "debug":
            deletePath = "/announcer/logs/debug.log";
            break;
        case "error":
            deletePath = "/announcer/logs/error_log.log";
            break;
    }

    if(deletePath != ""){
        try {
            date = new Date().toUTCString();
            fs.writeFileSync(deletePath, "", (err) => {
                if (err) throw err;
            });
            res.send({"reset": "success"});
        } catch(err) {
            res.send({"reset": "failed"});
        }
    }else{
        res.send({"reset": "failed"});
    }
});


const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
