const axios = require('axios');
const https = require('https');
const fs = require('fs');

/* const privateKey = fs.readFileSync('/https/node.key', 'utf8');
const certificate = fs.readFileSync('/https/node.crt', 'utf8');
const cacertificate = fs.readFileSync('/https/rootCA.crt', 'utf8');

const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
}); */

module.exports = {
    getOnlineStatus: () => {
        return instance.get('https://node:3443/status');
    },

    killServer: () => {
        return instance.post('https://node:3443/kill');
    },

    startServer: () => {
        return instance.post('https://node:3443/start');
    }
}