const fs = require('fs');
const logManager = require('./logManager.js');

module.exports = {

    read: function(path) {
        let rawdata = fs.readFileSync(path);
        let jObject = JSON.parse(rawdata);
        logManager.writeDebugLog(path + " wurde eingelesen.");
        return jObject;
    },

    write: function(path, value) {
        jObject = JSON.stringify(value)

        fs.writeFileSync(path, jObject, (err) => {
            if (err) throw err;
        });
        logManager.writeDebugLog(path + " wurde beschrieben.");
    },

    copy: function(source, destination){
        fs.copyFileSync(source, destination);
    },

    delete: function(path){
        fs.unlinkSync(path);
    }
}
