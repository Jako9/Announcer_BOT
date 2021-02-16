const jsonParser = require('./jsonParser.js');

module.exports = {
    addToPlaytime: function(time){
        let statistic = jsonParser.read("/announcer/statistics/statistics.json");
        statistic.totalPlaytime = statistic.totalPlaytime + time;
        jsonParser.write("/announcer/statistics/statistics.json", statistic);
    },

    joined: function(){
      let statistic = jsonParser.read("/announcer/statistics/statistics.json");
      statistic.timesJoined = statistic.timesJoined + 1;
      jsonParser.write("/announcer/statistics/statistics.json", statistic);
    },

    rickroll: function(){
      let statistic = jsonParser.read("/announcer/statistics/statistics.json");
      statistic.timesRickroll = statistic.timesRickroll + 1;
      jsonParser.write("/announcer/statistics/statistics.json", statistic);
    }
}
