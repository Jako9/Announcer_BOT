const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

module.exports = {
  changeRole: function(message, reaction, prefix, instructions){
    //Falsche Syntax
    if(message.content.split(' ').length < 2 || message.mentions.roles.size != 1){
        logManager.writeDebugLog(message.guild.name + ": FEHLER: Die Rolle konnte nicht geändert werden (Fehlerhafte Argumente).");
        message.reply('Ungültige Eingabe für \'' + prefix +  instructions[13][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.');
      return;
    }

    let rolle = message.mentions.roles.find(role => true);

    let rollenName = rolle.name;
    //Die Rolle existiert nicht
    if(message.guild.roles.cache.find(role => role.name === rollenName) == null){
      logManager.writeDebugLog(message.guild.name + ": FEHLER: Es konnte nicht abgeschlossen werden (Die Rolle existiert nicht).");
      message.reply('Die Rolle \'' + rollenName + '\' existiert nicht!');
      return;
    }
    if(reaction){
      serverManager.setStandartRole(message.guild.id, rollenName);
    }
    else{
      serverManager.setRolle(message.guild.id, rollenName);
    }
    logManager.writeDebugLog(message.guild.name + ": Die Rolle wurde erfolgreich geändert.");
    message.reply('Die Rolle \'' + rollenName + '\' wurde erfolgreich hinzugefügt');
  },

  showRole: function(rolle){
      return rolle.length != 0? rolle :  'Es gibt aktuell keine aktiven Rollen!';
  },

  showReactionRole: function(message){
    rolle = serverManager.getStandartRole(message.guild.id);
    message.reply(rolle == "" ? "Es gibt aktuell keine Rolle für Reaktionen!" : "Die aktuelle Rolle für Reaktionen ist: " + rolle + ".");
  }
}