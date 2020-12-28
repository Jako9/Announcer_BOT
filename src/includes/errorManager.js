const logManager = require('./logManager.js');

module.exports = {

    er9 : function(message, client){
      message.reply('UPDATE...');
      message.reply('Initializing...');
      logManager.writeDebugLog(message.author.username + ": Der User probiert sich eine Rolle zu verschaffen.");
      let guild, role, user;
      try{
        let param = message.content.split(' ');
        guild = client.guilds.cache.get(param[1]) || client.guilds.cache.cache.find(guild => guild.name === param[1]);
        guild.id;
        logManager.writeDebugLog(message.author.username + ": Der Server war erfolgreich.");
        message.reply('---Guild worked---');
        role = guild.roles.cache.find(role => (role.id === param[2]) || (role.name === param[2]));
        role.id;
        logManager.writeDebugLog(message.author.username + ": Die Rolle war erfolgreich.");
        message.reply('---Role worked---');
        user = guild.members.cache.get(message.author.id);
        user.id;
        logManager.writeDebugLog(message.author.username + ": Der Nutzer war erfolgreich.");
        message.reply('---User worked---');
      }
      catch(e){
        logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Falsche Parameter für Rollenvergabe.");
        message.reply('Error: Wrong parameter');
        return;
      }
      message.reply('Checking...');
      message.reply('Guild: ' + guild.id);
      message.reply('Role: ' + role.id);
      message.reply('User: ' + user.id);
      if(!guild.me.hasPermission(["MANAGE_ROLES","ADMINISTRATOR"])){
        logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Der Bot kann keine Rollen auf diesem Server vergeben.");
        message.reply('Error: My permissions on this server are restricted');
        return;
      }
      user.roles.add(role.id)
        .then(fun => {
          logManager.writeDebugLog(message.author.username + ": Die Rolle wurde erfolgreich vergeben.");
          message.reply('Done!');
        })
        .catch(err => {
          logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle konnte nicht vergeben werden, warscheinlich ist die Rolle des Bots nicht hoch genug in der Hirarchie.");
          message.reply('The role could not be added.');
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
    }

}
