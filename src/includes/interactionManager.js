const serverManager = require('./serverManager.js');


module.exports = {



  help: function (message, prefix, instructions){
    var msg = '``` \n------------------------------------------------------------- \n' +
    'The bot should connect and disconnect automatically but if there are ' +
    'any problems \nor if you want to customize usage you can use the following commands' +
    ' \n------------------------------------------------------------- \n  \n';
    for(var i = 0; i < instructions.length; i++){
      msg += ('[' + i + '] ' +  '\'' + prefix + instructions[i][0] + '\'' + instructions[i][1] + '\n \n');
    }
    message.reply(msg + '```');
  },



  changeCommands: function (message, prefix, instructions){
    var msg = message.content.split(' ');
    // Syntax für 'set' Befehl ist korrekt
    if(msg.length === 3 && msg[1] >= 0 && msg[1] < instructions.length){
      var oldBefehl = instructions[msg[1]][0];
      instructions[msg[1]][0] = msg[2];
      serverManager.setInstructions(message.guild.id, instructions);
      message.reply('Der Befehl \'' + prefix + oldBefehl + '\' heißt nun \'' + prefix + msg[2] + '\'');
    }
    else{
        message.reply('Ungültige Eingabe für \'' + prefix + instructions[3][0] + '\', schreibe \'' + prefix +  instructions[2][0] + '\' für korrekte Syntax.');
      }
  },



  changePrefix: function (message, prefix, instructions){
    if(message.content.split(' ').length == 2){
        message.reply('Der neue Präfix wurde erfolgreich auf \'' + message.content.split(' ')[1] + '\' gesetzt');
        return message.content.split(' ')[1];
    }
    else{
        message.reply('Ungültige Eingabe für \'' +  prefix +  instructions[7][0] + '\', schreibe \'' + prefix + instructions[2][0] + '\' für korrekte Syntax.');
        return null;
    }
  }
}