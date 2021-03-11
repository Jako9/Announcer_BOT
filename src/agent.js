const express = require('express')
const { spawn } = require('child_process');
const fs = require('fs');
let announcer = {};

//erstelle den Webserver
const app = express()
//Webserver läuft auf Port 3000
const port = 3000

announcer = spawn('node', ['announcer.js']);

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
    announcer = spawn('node', ['announcer.js']);
    res.send({"pid": announcer.pid});
});

//Beendet die Nodeapplikation
app.post('/kill', function (req, res) {
    //Schickt an den Bot-Childprocess ein Sigterm um ihm zu beenden
    announcer.kill('SIGTERM');
    announcer = {};
    res.send({"pid": announcer.pid});
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



app.listen(port, function () {
  console.log('Der Bot lauscht auf ' + port)
})