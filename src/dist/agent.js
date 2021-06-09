"use strict";
/* tslint:disable:no-var-requires */
Object.defineProperty(exports, "__esModule", { value: true });
var sms = require('source-map-support'); // Allows error-messages to point to .ts files
sms.install(); // Installs error-message fix
/* Begin import section */
var express = require("express");
var fs = require('fs');
var http = require('http');
var https = require('https');
var spawn = require('child_process').spawn;
var type = require('os').type;
/* End import section */
var Agent = /** @class */ (function () {
    function Agent() {
    }
    Agent.prototype.ysgff = function () {
        this.announcer = { pid: -1 }; // Initializes the announcer object where we store the child processes
        this.credentials = {};
    };
    Agent.prototype.startBot = function () {
        // this.readInCertificate(); // Read in website certificates
        var app = express(); // Create express-server
        this.announcer = spawn('node', ['/announcer/code/announcer.js']); // Create new child process running the actual code of the bot
        var parentScope = this; // save the parent scope to refer to in the routes
        app.get('/status', function (req, res) {
            var running = 0;
            if (parentScope.announcer.pid !== -1) { // check if the pid-value has changed from the initial value
                running = 1;
            }
            res.send({ "running": running }); // return the current state as JSON
        });
        app.post('/start', function (_req, res) {
            parentScope.announcer = spawn('node', ['/announcer/code/announcer.js']); // create a new bot child-process and safe the returned object
            res.send({ "pid": parentScope.announcer.pid }); // return the pid as JSON
        });
        app.post('/kill', function (_req, res) {
            if (parentScope.announcer.pid !== -1) { // if the pid is the init-value
                parentScope.announcer.kill('SIGTERM'); // send a SIGTERM to the child-process to kill it
                parentScope.announcer = { pid: -1 }; // set the pid to its initial state
                res.send({ "pid": parentScope.announcer.pid }); // return the new set pid
            }
            else {
                res.send({}); // if the pid is the initial value send nothing
                // a better pratice here, would be the returning of -1
            }
        });
        app.post('/log/clear/:log', function (req, res) {
            var deletePath = "";
            switch (req.params.log) { // switch the given log-name
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
            if (deletePath !== "") { // if the delePath variable has not the initial value
                try {
                    fs.writeFileSync(deletePath, "", function (err) {
                        if (err)
                            throw err;
                    });
                    res.send({ "reset": "success" }); // send a success message
                }
                catch (err) {
                    res.send({ "reset": "failed" }); // send an error message
                }
            }
            else {
                res.send({ "reset": "failed" }); // send an error message
            }
        });
        var httpServer = http.createServer(app);
        var httpsServer = https.createServer(this.credentials, app);
        httpServer.listen(80);
        httpsServer.listen(3443);
    };
    Agent.prototype.readInCertificate = function () {
        try {
            var privateKey = fs.readFileSync('/https/node.key', 'utf8');
            var certificate = fs.readFileSync('/https/node.crt', 'utf8');
            var cacertificate = fs.readFileSync('/https/rootCA.crt', 'utf8');
            this.credentials = {
                key: privateKey,
                cert: certificate,
                ca: cacertificate,
                rejectUnauthorized: false
            };
        }
        catch (err) {
            throw err;
        }
    };
    return Agent;
}());
var agentObj = new Agent(); // Create an agent-obejct
agentObj.startBot(); // start the bot
//# sourceMappingURL=agent.js.map