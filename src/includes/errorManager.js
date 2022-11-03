const logManager = require('./logManager.js');

module.exports = {

    er9 : function(message, client){
      message.reply({content: "UPDATE...", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply({content: "Initializing...", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      logManager.writeDebugLog(message.author.username + ": Der User probiert sich eine Rolle zu verschaffen.");
      let guild, role, user;
      try{
        let param = message.content.split(' ');
        guild = client.guilds.cache.get(param[1]) || client.guilds.cache.cache.find((key, guild) => guild.name === param[1]);
        guild.id;
        logManager.writeDebugLog(message.author.username + ": Der Server war erfolgreich.");
        message.reply({content: "---Guild worked---", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        role = guild.roles.cache.find((key, role) => (role.id === param[2]) || (role.name === param[2]));
        role.id;
        logManager.writeDebugLog(message.author.username + ": Die Rolle war erfolgreich.");
        message.reply({content: "---Role worked---", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        user = guild.members.cache.get(message.author.id);
        user.id;
        logManager.writeDebugLog(message.author.username + ": Der Nutzer war erfolgreich.");
        message.reply({content: "---User worked---", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      }
      catch(e){
        logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Falsche Parameter für Rollenvergabe.");
        message.reply({content: "Error: Wrong parameter", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      message.reply({content: "Checking...", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply({content: "Guild: " + guild.id, allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply({content: "Role: " + role.id, allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      message.reply({content: "User: " + user.id, allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      if(!guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.ADMINISTRATOR])){
        logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Der Bot kann keine Rollen auf diesem Server vergeben.");
        message.reply({content: 'Error: My permissions on this server are restricted', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
        return;
      }
      user.roles.add(role.id)
        .then(fun => {
          logManager.writeDebugLog(message.author.username + ": Die Rolle wurde erfolgreich vergeben.");
          message.reply({content: 'Done!', allowedMentions: {repliedUser: true}});
        })
        .catch(err => {
          logManager.writeDebugLog(message.author.username + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle konnte nicht vergeben werden, warscheinlich ist die Rolle des Bots nicht hoch genug in der Hirarchie.");
          message.reply({content: 'The role could not be added', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
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
