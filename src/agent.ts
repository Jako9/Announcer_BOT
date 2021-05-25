/* tslint:disable:no-var-requires */

const sms = require('source-map-support'); // Allows error-messages to point to .ts files
sms.install(); // Installs error-message fix

/* Begin import section */

import express = require('express');

const fs = require('fs');
const http = require('http');
const https = require('https');
const { spawn } = require('child_process');
const { type } = require('os');

/* End import section */

class Agent{
    announcer: any;
    credentials: object;

    constructor(){
        this.announcer = { pid: -1 }; // Initializes the announcer object where we store the child processes
        this.credentials = {};
    }

    startBot(){
        // this.readInCertificate(); // Read in website certificates
        const app: express.Application = express(); // Create express-server
        this.announcer = spawn('node', ['/announcer/code/announcer.js']); // Create new child process running the actual code of the bot

        const parentScope = this; // save the parent scope to refer to in the routes

        app.get('/status', (req, res) => { // Route to return current status of the bot
            let running: number = 0;
            if(parentScope.announcer.pid !== -1){ // check if the pid-value has changed from the initial value
                running = 1;
            }
            res.send({"running": running}); // return the current state as JSON
        });

        app.post('/start', (_req, res) => {
            parentScope.announcer = spawn('node', ['/announcer/code/announcer.js']); // create a new bot child-process and safe the returned object
            res.send({"pid": parentScope.announcer.pid}); // return the pid as JSON
        });

        app.post('/kill', (_req, res) => { // kill the announcer child process
            if(parentScope.announcer.pid !== -1){ // if the pid is the init-value
                parentScope.announcer.kill('SIGTERM'); // send a SIGTERM to the child-process to kill it
                parentScope.announcer = { pid: -1 }; // set the pid to its initial state
                res.send({"pid": parentScope.announcer.pid}); // return the new set pid
            }else{
                res.send({}); // if the pid is the initial value send nothing

                // a better pratice here, would be the returning of -1
            }
        });

        app.post('/log/clear/:log', (req, res) => { // route responsible for the deletion of the given log
            let deletePath: string = "";

            switch(req.params.log){ // switch the given log-name
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

            if(deletePath !== ""){ // if the delePath variable has not the initial value
                try {
                    fs.writeFileSync(deletePath, "", (err: Error) => { // write an empty string to the log that should be deleted
                        if (err) throw err;
                    });
                    res.send({"reset": "success"}); // send a success message
                } catch(err) {
                    res.send({"reset": "failed"}); // send an error message
                }
            }else{
                res.send({"reset": "failed"}); // send an error message
            }
        });

        const httpServer = http.createServer(app);
        const httpsServer = https.createServer(this.credentials, app);

        httpServer.listen(80);

        httpsServer.listen(3443);
    }

    readInCertificate(){
        try{
            const privateKey: string = fs.readFileSync('/https/node.key', 'utf8');
            const certificate: string = fs.readFileSync('/https/node.crt', 'utf8');
            const cacertificate: string = fs.readFileSync('/https/rootCA.crt', 'utf8');

            this.credentials = {
                key: privateKey,
                cert: certificate,
                ca: cacertificate,
                rejectUnauthorized: false
            }
        }catch(err){
            throw err;
        }
    }
}

const agentObj: Agent = new Agent(); // Create an agent-obejct
agentObj.startBot(); // start the bot
