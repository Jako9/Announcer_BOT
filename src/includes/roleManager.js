const serverManager = require('./serverManager.js');


module.exports = {
  addRole: function(message, rollen, prefix, instructions){
    if(message.content.split(' ').length >= 2){
        var tmpMessage = '';
        for(var i = 1; i < message.content.split(' ').length  - 1; i++){
          tmpMessage += message.content.split(' ')[i]   + ' ';
        }
        tmpMessage += message.content.split(' ')[message.content.split(' ').length - 1];
        // Maximale Rollenanzahl  =  40
        if(rollen.length <= 40){
          // Ob die Rolle schon hinzugefügt wurde
          if(!rollen.includes(tmpMessage)){
            // Ob die Rolle überhaupt existiert
            if(message.guild.roles.cache.find(role => role.name === tmpMessage) !== null){
              rollen.push(tmpMessage);
              serverManager.setRollen(message.guild.id, rollen);
              message.reply('Die Rolle \'' + tmpMessage + '\' wurde erfolgreich hinzugefügt');
            }
            else{
              message.reply('Die Rolle \'' + tmpMessage + '\' existiert nicht!');
            }
          }
          else{
            message.reply('Die Rolle \'' + tmpMessage + '\' ist schon aktiv du Kek!');
          }
        }
        else{
          message.reply('Es dürfen maximal 40 Rollen gleichzeitig aktiv sein!');
        }
      }
      else{
        message.reply('Ungültige Eingabe für \'' + prefix +  instructions[4][0] + '\', schreibe \'' + prefix +  instructions[2][0] + '\' für korrekte Syntax.');
      }
    },


    removeRole: function(message, rollen, prefix, instructions){
      if(message.content.split(' ').length == 2 && message.content.split(' ')[1] >= 0 && message.content.split(' ')[1] < rollen.length){
          var tmpRolle = rollen.splice(message.content.split(' ')[1], 1);
          serverManager.setRollen(message.guild.id, rollen);
          message.reply('Die Rolle \'' + tmpRolle + '\' wurde erfolgreich entfernt');
        }
        else{
          message.reply('Ungültige Eingabe für \'' + prefix +  instructions[5][0] + '\', schreibe \'' + prefix + instructions[2][0] + '\' für korrekte Syntax.');
        }
  },


  showRoles: function(message, rollen){
      var alleRollen = '```';
      for(var i = 0; i < rollen.length; i++){
        alleRollen += i + ' ' + rollen[i] + '\n';
      }
      alleRollen += '```';
      rollen.length != 0? message.reply(alleRollen) :  message.reply('Es gibt  aktuell keine aktiven Rollen!');

  }
}
