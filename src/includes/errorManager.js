const logManager = require('./logManager.js');

module.exports = {

    er9 : function(message, client){
      message.reply('UPDATE...').catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply('Initializing...').catch(err => {logManager.writeErrorLog(err.stack);});
      logManager.writeDebugLog(message.author.username + ": Der User probiert sich eine Rolle zu verschaffen.");
      let guild, role, user;
      try{
        let param = message.content.split(' ');
        guild = client.guilds.cache.get(param[1]) || client.guilds.cache.cache.find(guild => guild.name === param[1]);
        guild.id;
        logManager.writeDebugLog(message.author.username + ": Der Server war erfolgreich.");
        message.reply('---Guild worked---').catch(err => {logManager.writeErrorLog(err.stack);});
        role = guild.roles.cache.find(role => (role.id === param[2]) || (role.name === param[2]));
        role.id;
        logManager.writeDebugLog(message.author.username + ": Die Rolle war erfolgreich.");
        message.reply('---Role worked---').catch(err => {logManager.writeErrorLog(err.stack);});
        user = guild.members.cache.get(message.author.id);
        user.id;
        logManager.writeDebugLog(message.author.username + ": Der Nutzer war erfolgreich.");
        message.reply('---User worked---').catch(err => {logManager.writeErrorLog(err.stack);});
      }
      catch(e){
        logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Falsche Parameter für Rollenvergabe.");
        message.reply('Error: Wrong parameter').catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      message.reply('Checking...').catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply('Guild: ' + guild.id).catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply('Role: ' + role.id).catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply('User: ' + user.id).catch(err => {logManager.writeErrorLog(err.stack);});
      if(!guild.me.hasPermission(["MANAGE_ROLES","ADMINISTRATOR"])){
        logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Der Bot kann keine Rollen auf diesem Server vergeben.");
        message.reply('Error: My permissions on this server are restricted').catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      user.roles.add(role.id)
        .then(fun => {
          logManager.writeDebugLog(message.author.username + ": Die Rolle wurde erfolgreich vergeben.");
          message.reply('Done!');
        })
        .catch(err => {
          logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle konnte nicht vergeben werden, warscheinlich ist die Rolle des Bots nicht hoch genug in der Hirarchie.");
          message.reply('The role could not be added.').catch(err => {logManager.writeErrorLog(err.stack);});
        });
    },

    restartAnnounce: function(client){
      client.user.setActivity("DEBUGGING SOON...", {
        type: "STREAMING",
        url: "https://www.twitch.tv/jako9"
      });
    },

    restartAnnounceRemove: function(client){
      client.user.setActivity(".help", {
        type: "WATCHING"
      });
    },

    setAnnouncement: function(client, message){
      let args = message.split(' ');
      if(args.length < 3 || args[0] != "setStatus") return;
      let msg = args[2];
      for(let i = 3; i < args.length; i++){
        msg += " ";
        msg += args[i];
      }
      if(args[1].toLowerCase() == "playing"){
        client.user.setActivity(msg, {
          type: "PLAYING"
        });
      }
      else if(args[1].toLowerCase() == "watching"){
        client.user.setActivity(msg, {
          type: "WATCHING"
        });
      }
      else if(args[1].toLowerCase() == "streaming"){
        client.user.setActivity(msg, {
          type: "STREAMING",
          url: "https://www.twitch.tv/jako9"
        });
      }
    }

}
