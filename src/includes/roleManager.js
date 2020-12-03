const serverManager = require('./serverManager.js');

module.exports = {
  changeRole: function(message, prefix, instructions){
    //Falsche Syntax
    if(message.content.split(' ').length < 2){
      message.reply('Ungültige Eingabe für \'' + prefix +  instructions[4][0] + '\', schreibe \'' + prefix +  instructions[2][0] + '\' für korrekte Syntax.');
      return;
    }
    let rollenName = '';
    //Falls Rollename SPACE enthält
    let param = message.content.split(' ');
    for(var i = 1; i < param.length; i++){
      rollenName += param[i]   + ' ';
    }
    rollenName = rollenName.substring(0, rollenName.length - 1);
    //Die Rolle existiert nicht
    if(message.guild.roles.cache.find(role => role.name === rollenName) == null){
      message.reply('Die Rolle \'' + rollenName + '\' existiert nicht!');
      return;
    }
    serverManager.setRolle(message.guild.id, rollenName);
    message.reply('Die Rolle \'' + rollenName + '\' wurde erfolgreich hinzugefügt');
  },

  showRole: function(rolle){
      return rolle.length != 0? rolle :  'Es gibt aktuell keine aktiven Rollen!';
  }
}
