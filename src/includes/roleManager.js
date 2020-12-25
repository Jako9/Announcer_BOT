const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

module.exports = {
  changeRole: function(message, reaction, prefix, instructions){
    //Falsche Syntax
    if(message.content.split(' ').length < 2 || message.mentions.roles.size != 1){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle konnte nicht geändert werden (Fehlerhafte Argumente).");
        message.reply('Ungültige Eingabe für \'' + prefix +  instructions[13][0].name + '\', schreibe \'' + prefix +  instructions[4][0].name + '\' für korrekte Syntax.');
      return;
    }

    let rolle = message.mentions.roles.find(role => true);

    let rollenName = rolle.name;
    let rollenID = rolle.id;
    //Die Rolle existiert nicht
    if(message.guild.roles.cache.find(role => role.id === rollenID) == null){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Es konnte nicht abgeschlossen werden (Die Rolle existiert nicht).");
      message.reply('Die Rolle \'' + rollenName + '\' existiert nicht!');
      return;
    }
    if(reaction){
      serverManager.setStandartRole(message.guild.id,{'name': rollenName,'id':rollenID});
    }
    else{
      serverManager.setRolle(message.guild.id,  {'name': rollenName,'id':rollenID});
    }
    logManager.writeDebugLog(message.guild.name + ": Die Rolle wurde erfolgreich geändert.");
    message.reply('Die Rolle \'' + rollenName + '\' wurde erfolgreich hinzugefügt');
  },

  showRole: function(rolle){
      return rolle.id != ""? rolle.name :  'Es gibt aktuell keine aktiven Rollen!';
  },

  showReactionRole: function(message){
    rolle = serverManager.getStandartRole(message.guild.id);
    message.reply(rolle.id == "" ? "Es gibt aktuell keine Rolle für Reaktionen!" : "Die aktuelle Rolle für Reaktionen ist: " + rolle.name + ".");
  },

  removeReactionRole: function(message){
    serverManager.setStandartRole(message.guild.id, {"name":"","id":""});
    message.reply("Die Standartrolle für Reaktionen wurde erfolgreich entfernt.");
  }
}
