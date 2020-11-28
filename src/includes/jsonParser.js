const fs = require('fs');

module.exports = {
    read: function(path) {
        let rawdata = fs.readFileSync(path);
        let jObject = JSON.parse(rawdata);

        return jObject;
    },

    write: function(path, value) {
        jObject = JSON.stringify(value)

        fs.writeFile(path, jObject, (err) => {
            if (err) throw err;
        }); 
    },

    copy: function(source, destination){
        fs.copyFileSync(source, destination);
    },


    delete: function(path){
        fs.unlinkSync(path);
    }



}