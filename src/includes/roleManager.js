const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

module.exports = {
  changeRole: function(message, reaction, prefix, instructions){
    //Falsche Syntax
    if(message.content.split(' ').length < 2 || message.mentions.roles.size != 1){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle konnte nicht geändert werden (Fehlerhafte Argumente).");
        message.reply('Incorrect usage of \'' + prefix +  instructions[10][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.').catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    let rolle = message.mentions.roles.find(role => true);

    let rollenName = rolle.name;
    let rollenID = rolle.id;
    //Die Rolle existiert nicht
    if(message.guild.roles.cache.find(role => role.id === rollenID) == null){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Die Rolle existiert nicht).");
      message.reply('The role \'' + rollenName + '\' doesn\'t exist!').catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    if(reaction){
      serverManager.setStandartRole(message.guild.id,{'name': rollenName,'id':rollenID});
    }
    else{
      serverManager.setRolle(message.guild.id,  {'name': rollenName,'id':rollenID});
    }
    logManager.writeDebugLog(message.guild.name + ": Die Rolle wurde erfolgreich geändert.");
    message.reply('The role has been set to \'' + rollenName + '\'.').catch(err => {logManager.writeErrorLog(err.stack);});
  },

  showRole: function(rolle){
      return rolle.id != ""? rolle.name :  'There is no active modRole!';
  },

  showReactionRole: function(message){
    rolle = serverManager.getStandartRole(message.guild.id);
    message.reply(rolle.id == "" ? "There is no standart role for reaction!" : "The standart role for reactions is: " + rolle.name + ".").catch(err => {logManager.writeErrorLog(err.stack);});
  },

  removeReactionRole: function(message){
    if(serverManager.getStandartRole(message.guild.id).id == ""){
      message.reply("There is no reaction role setup that can be removed.").catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    serverManager.setStandartRole(message.guild.id, {"name":"","id":""});
    message.reply("The standart role for reactions has been removed successfully.").catch(err => {logManager.writeErrorLog(err.stack);});
  }
}
