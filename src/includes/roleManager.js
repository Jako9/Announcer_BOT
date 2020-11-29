const serverManager = require('./serverManager.js');

module.exports = {
  addRole: function(message, rollen, prefix, instructions){
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
    // Ob die Rolle schon hinzugefügt wurde
    if(rollen.includes(rollenName)) {
      message.reply('Die Rolle \'' + rollenName + '\' ist schon aktiv du Kek!');
      return;
    }
    rollen.push(rollenName);
    serverManager.setRollen(message.guild.id, rollen);
    message.reply('Die Rolle \'' + rollenName + '\' wurde erfolgreich hinzugefügt');
  },

    removeRole: function(message, rollen, prefix, instructions){
      let param = message.content.split(' ');
      //Falsche Syntax
      if(param.length != 2 || param[1] < 0 || param[1] >= rollen.length){
        message.reply('Ungültige Eingabe für \'' + prefix +  instructions[5][0] + '\', schreibe \'' + prefix + instructions[2][0] + '\' für korrekte Syntax.');
        return;
      }
      var tmpRolle = rollen.splice(param[1], 1);
      serverManager.setRollen(message.guild.id, rollen);
      message.reply('Die Rolle \'' + tmpRolle + '\' wurde erfolgreich entfernt');
  },

  showRoles: function(rollen){
      var alleRollen = '```';
      for(var i = 0; i < rollen.length; i++){
        alleRollen += i + ' ' + rollen[i] + '\n';
      }
      return rollen.length != 0? alleRollen += '```' :  'Es gibt  aktuell keine aktiven Rollen!';
  }
}
