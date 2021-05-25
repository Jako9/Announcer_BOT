const fs = require('fs');

module.exports = {
    writeBootLog: function(message) {

        bootLogPath = "/announcer/logs/boot_log.log"

        try {
            date = new Date().toUTCString();
            fs.appendFileSync(bootLogPath, "<span style='color:#A3BE8C;'>[" + date + "]</span> " + message + "\n<br>", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            console.error('Error while logging to the bootlog. Please check the write access to the logs folder!')
        }
    },


    writeDebugLog: function(message) {

        debugLogPath = "/announcer/logs/debug.log"

        try {
            date = new Date().toUTCString();
            fs.appendFileSync(debugLogPath, "<span style='color:#A3BE8C;'>[" + date + "]</span> " + message + "\n<br>", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            console.error('Error while logging to the debuglog. Please check the write access to the logs folder!')
        }
    },

    writeErrorLog: function(message) {

        errorLogPath = "/announcer/logs/error_log.log"

        try {
            date = new Date().toUTCString();
            fs.appendFileSync(errorLogPath, "<span style='color:#BF616A;'>[" + date + "]</span> " + message + "\n<br>", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            console.error('Error while logging to the errorlog. Please check the write access to the logs folder!')
        }
    }
}
