const fs = require('fs');
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
        const fileToWrite  = fs.createWriteStream(path + id + ".mp3");
        const request = http.get(link, function(response) {
            response.pipe(file);
        });

        return fileToWrite.path;
    }
}
