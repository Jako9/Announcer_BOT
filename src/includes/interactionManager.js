const serverManager = require('./serverManager.js');

module.exports = {

  //Create a list of all commands and their usage
  help: function (prefix, instructions){
    var msg = '``` \n------------------------------------------------------------- \n' +
              'The bot should connect and disconnect automatically but if there are ' +
              'any problems \nor if you want to customize usage you can use the following commands' +
              ' \n------------------------------------------------------------- \n  \n';
    for(var i = 0; i < instructions.length; i++){
      msg += ('[' + i + '] ' +  '\'' + prefix + instructions[i][0] + '\'' + instructions[i][1] + '\n \n');
    }
    return msg + '```';
  },

  changeCommands: function (message, prefix, instructions){
    var msg = message.content.split(' ');
    // Syntax für 'set' Befehl ist nicht korrekt
    if(msg.length !== 3 || msg[1] < 0 || msg[1] >= instructions.length)
      return 'Ungültige Eingabe für \'' + prefix + instructions[3][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.';

    var oldBefehl = instructions[msg[1]][0];
    instructions[msg[1]][0] = msg[2];
    serverManager.setInstructions(message.guild.id, instructions);
    return 'Der Befehl \'' + prefix + oldBefehl + '\' heißt nun \'' + prefix + msg[2] + '\'';

  },

  changePrefix: function (message, prefix, instructions){
    var param = message.content.split(' ');
    if(param.length != 2){
      message.reply('Ungültige Eingabe für \'' +  prefix +  instructions[7][0] + '\', schreibe \'' + prefix + instructions[4][0] + '\' für korrekte Syntax.');
      return null;
    }
    message.reply('Der neue Präfix wurde erfolgreich auf \'' + param[1] + '\' gesetzt');
    return param[1];
  },

  setVolume: function(message){
    var param = message.content.split(' ');
    //Ungültige Anzahl an Argumenten
    if (param.length != 2){
      message.reply("Falsche Eingabe..");
      return;
    }

    //Keine Nummer
    try{
      volume = parseInt(param[1]);
      //Nummer nicht im gültigen bereich
      if (volume < 0 || volume > 100){
        message.reply("Die Lautstärke muss zwischen 0 und 100 liegen.");
        return;
      }

      serverManager.setVolume(message.guild.id, volume / 100.0);
      message.reply("Das Volume wurde auf " + volume +"% gesetzt.");
    }
    catch(e){
      message.reply("Die Lautstärke muss eine ganze Zahl sein! " + e);
      return;
    }

  },

  getVolume: function(message){
    return serverManager.getVolume(message.guild.id);
  }
}
