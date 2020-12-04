const fs = require('fs');
const path = "/home/max/Dokumente/Bastelordner/Announcer_BOT/logs/";

module.exports = {
    writeBootLog: function(message) {
        
        bootLogPath = path + "boot_log.log"

        try {
            date = new Date().toUTCString();
            fs.appendFile(bootLogPath, "[" + date + "] " + message + "\n", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            console.error('Error while logging to the bootlog. Please check the write access to the logs folder!')
        }
    },

    writeDebugLog: function(message) {
        
        debugLogPath = path + "debug.log"

        try {
            date = new Date().toUTCString();
            fs.appendFile(debugLogPath, "[" + date + "] " + message + "\n", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            console.error('Error while logging to the debuglog. Please check the write access to the logs folder!')
        }
    },
}