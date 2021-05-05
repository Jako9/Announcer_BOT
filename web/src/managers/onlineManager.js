const axios = require('axios');
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync('/https/node.key', 'utf8');
const certificate = fs.readFileSync('/https/node.crt', 'utf8');
const cacertificate = fs.readFileSync('/https/rootCA.crt', 'utf8');

const agent = new https.Agent({  
    rejectUnauthorized: false,
    key: privateKey,
	cert: certificate,
    ca: cacertificate
});

module.exports = {
    getOnlineStatus: () => {
        return axios.get('https://node:3443/status',  { httpsAgent: agent });
    },

    killServer: () => {
        return axios.post('https://node:3443/kill',  { httpsAgent: agent });
    },

    startServer: () => {
        return axios.post('https://node:3443/start',  { httpsAgent: agent });
    }
}