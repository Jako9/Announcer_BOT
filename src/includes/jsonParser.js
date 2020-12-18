const fs = require('fs');
let https = require("https");
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

    download: async function(path, link, id){
        const fileToWrite  = fs.createWriteStream(path + id + ".mp3");
        const request = await https.get(link, function(response) {
            response.pipe(fileToWrite);
        });

        return fileToWrite.path;
    }
}
