const serverManager = require('./serverManager.js');

module.exports = {
  changeRole: function(message, reaction, prefix, instructions){
    //Falsche Syntax
    if(message.content.split(' ').length < 2 || message.mentions.roles.size != 1){
      if(reaction){
        message.reply('Ungültige Eingabe für \'' + prefix +  instructions[13][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.');
      }
      else{
        message.reply('Ungültige Eingabe für \'' + prefix +  instructions[6][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.');
      }
      return;
    }

    let rolle = message.mentions.roles.find(role => true);

    let rollenName = rolle.name;
    //Die Rolle existiert nicht
    if(message.guild.roles.cache.find(role => role.name === rollenName) == null){
      message.reply('Die Rolle \'' + rollenName + '\' existiert nicht!');
      return;
    }
    if(reaction){
      serverManager.setStandartRole(message.guild.id, rollenName);
    }
    else{
      serverManager.setRolle(message.guild.id, rollenName);
    }
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
