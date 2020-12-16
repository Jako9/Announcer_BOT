const jsonParser = require('./jsonParser.js');
const PATH = "/var/www/git.jmk.cloud/html/Announcer_BOT";

module.exports = {
    addToPlaytime: function(time){
        let statistic = jsonParser.read(PATH + "/config/statistics/statistics.json");
        statistic.totalPlaytime = statistic.totalPlaytime + time;
        jsonParser.write(PATH + "/config/statistics/statistics.json", statistic);
    },

    joined: function(){
      let statistic = jsonParser.read(PATH + "/config/statistics/statistics.json");
      statistic.timesJoined = statistic.timesJoined + 1;
      jsonParser.write(PATH + "/config/statistics/statistics.json", statistic);
    },

    rickroll: function(){
      let statistic = jsonParser.read(PATH + "/config/statistics/statistics.json");
      statistic.timesRickroll = statistic.timesRickroll + 1;
      jsonParser.write(PATH + "/config/statistics/statistics.json", statistic);
    }
}
