const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

function contains(arr, word){
  for(let i = 0; i < arr.length; i++){
    if(arr[i][0] == word) return true;
  }
  return false;
}
module.exports = {

  //Create a list of all commands and their usage
  help: function (prefix, instructions){
    logManager.writeDebugLog("3");
    var msg = '``` \n------------------------------------------------------------- \n' +
              'The bot should connect and disconnect automatically but if there are ' +
              'any problems \nor if you want to customize usage you can use the following commands' +
              ' \n------------------------------------------------------------- \n  \n';
    for(var i = 0; i < instructions.length; i++){
      msg += ('[' + i + '] ' +  '\'' + prefix + instructions[i][0] + '\'' + instructions[i][1] + '\n \n');
    }
    logManager.writeDebugLog("4");
    return msg + '```';
  },

  changeCommands: function (message, prefix, instructions){
    var msg = message.content.split(' ');
    // Syntax für 'set' Befehl ist nicht korrekt
    if(msg.length !== 3 || msg[1] < 0 || msg[1] >= instructions.length){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#BF616A;'>FEHLER</span>: Der Befehl konnte nicht umbenannt werden (Fehlerhafte Argumente).");
      return 'Ungültige Eingabe für \'' + prefix + instructions[5][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.';
    }

    if(contains(instructions, msg[2])){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Befehl konnte nicht umbenannt werden (Den Namen gibt es schon).");
      return 'Ungültige Eingabe für \'' + prefix + instructions[5][0] + '\', den Befehl \'' + msg[2] + '\' gibt es schon.';
    }

    var oldBefehl = instructions[msg[1]][0];
    instructions[msg[1]][0] = msg[2];
    serverManager.setInstructions(message.guild.id, instructions);
    logManager.writeDebugLog(message.guild.name + ": Der Befehl: " + oldBefehl + " wurde zu: " + msg[2] + " umbennant.");
    return 'Der Befehl \'' + prefix + oldBefehl + '\' heißt nun \'' + prefix + msg[2] + '\'';

  },

  changePrefix: function (message, prefix, instructions){
    var param = message.content.split(' ');
    if(param.length != 2 || param[1].length != 1){
      message.reply('Ungültige Eingabe für \'' +  prefix +  instructions[8][0] + '\', schreibe \'' + prefix + instructions[4][0] + '\' für korrekte Syntax.');
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Präfix konnte nicht geändert werden (Fehlerhafte Argumente).");
      return null;
    }
    logManager.writeDebugLog(message.guild.name + ": Der Präfix wurde erfolgreich auf: \"" + param[1] + "\" gesetzt.");
    message.reply('Der neue Präfix wurde erfolgreich auf \'' + param[1] + '\' gesetzt');
    return param[1];
  },

  setVolume: function(message){
    var param = message.content.split(' ');
    //Ungültige Anzahl an Argumenten
    if (param.length != 2){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Lautstärke konnte nicht geändert werden (Fehlerhafte Argumente).");
      message.reply("Falsche Eingabe..");
      return;
    }

    //Keine Nummer
    try{
      volume = parseInt(param[1]);
      //Nummer nicht im gültigen bereich
      if (volume < 0 || volume > 100){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Lautstärke konnte nicht geändert werden (Fehlerhafte Argumente).");
        message.reply("Die Lautstärke muss zwischen 0 und 100 liegen.");
        return;
      }

      serverManager.setVolume(message.guild.id, volume / 100.0);
      logManager.writeDebugLog(message.guild.name + ": Die Lautstärke wurde erfolgreich auf " + volume + "% gesetzt.");
      message.reply("Das Volume wurde auf " + volume +"% gesetzt.");
    }
    catch(e){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Lautstärke konnte nicht geändert werden (Fehlerhafte Argumente).");
      message.reply("Die Lautstärke muss eine ganze Zahl sein! " + e);
      return;
    }

  },

  getVolume: function(message){
    return serverManager.getVolume(message.guild.id);
  }
}
