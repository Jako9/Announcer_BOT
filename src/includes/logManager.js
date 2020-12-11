const fs = require('fs');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

module.exports = {
    writeBootLog: function(message) {

        bootLogPath = PATH + "/logs/boot_log.log"

        try {
            date = new Date().toUTCString();
            fs.appendFileSync(bootLogPath, "<span style='color:#A3BE8C;'>[" + date + "]</span> " + message + "\n", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            console.error('Error while logging to the bootlog. Please check the write access to the logs folder!')
        }
    },

    writeDebugLog: function(message) {

        debugLogPath = PATH + "/logs/debug.log"

        try {
            date = new Date().toUTCString();
            fs.appendFileSync(debugLogPath, "<span style='color:#A3BE8C'>[" + date + "]</span> " + message + "\n", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            console.error('Error while logging to the debuglog. Please check the write access to the logs folder!')
        }
    },

    writeErrorLog: function(message) {

        errorLogPath = PATH + "/logs/error_log.log"

        try {
            date = new Date().toUTCString();
            fs.appendFileSync(errorLogPath, "<span style='color:#A3BE8C;'>[" + date + "]</span> " + message + "\n", (err) => {
                if (err) throw err;
            });
        } catch(err) {
            //console.error('Error while logging to the errorlog. Please check the write access to the logs folder!')
        }
    }
}
