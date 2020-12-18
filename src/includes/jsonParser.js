const fs = require('fs');
let https = require("https");
let axios = require('axios');
const logManager = require('./logManager.js');

module.exports = {

    read: function(path) {
        let rawdata = fs.readFileSync(path);
        let jObject = JSON.parse(rawdata);
        return jObject;
    },

    write: function(path, value) {
        jObject = JSON.stringify(value)

        fs.writeFileSync(path, jObject, (err) => {
            if (err) throw err;
        });
    },

    copy: function(source, destination){
        fs.copyFileSync(source, destination);
    },

    delete: function(path){
        fs.unlinkSync(path);
    },

    download: function(path, link, id){
        return axios.request({
            responseType: 'arraybuffer',
            url: link,
            method: 'get',
            headers: {
              'Content-Type': 'audio/mpeg',
            },
          }).then((result) => {
            const outputFilename = path;
            fs.writeFileSync(outputFilename, result.data);
            return outputFilename;
          });
    }
}
