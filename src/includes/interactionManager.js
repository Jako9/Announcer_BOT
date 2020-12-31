const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

function contains(arr, word){
  for(let i = 0; i < arr.length; i++){
    if(arr[i][0].name == word) return true;
  }
  return false;
}

function buildEmbed(commands, page, maxPage){
  let hyperlink = '[wiki](https://github.com/Jako9/Announcer_BOT/wiki \"help\")';
  let embed = {
    color: 0x161616,
    title: 'Get some help',
    url: "https://github.com/Jako9/Announcer_BOT/wiki",
    author: {
  		name: 'Announcer_BOT',
  		icon_url: 'https://cdn.discordapp.com/avatars/541676543525519360/f7ee86514955577f12f1a9aca6001371.png?size=256',
  		url: 'http://announcer.jmk.cloud'
  	},
    description: 'If you want to know **how** or **when** to use these commands \nor how to **setup** the bot correctly, \ncheck out our ' + hyperlink + ' and follow the steps provided!',
    thumbnail: {
  		url: 'https://cdn.discordapp.com/avatars/541676543525519360/f7ee86514955577f12f1a9aca6001371.png?size=256'
  	},
    fields: commands,
    footer: {
  		text: 'Page ' + page + ' of ' + maxPage
  	}
  };
  return embed;
}

module.exports = {

  //Create a list of all commands and their usage
  help: function (message, prefix, instructions){
    let page = 1;
    let maxPage = (instructions.length / 10) + 1
    if (instructions.length % 10 == 0){
      maxPage--;
    }
    if(message.content.split(' ').length == 2 && !isNaN(message.content.split(' ')[1])){
      page = message.content.split(' ')[1];
      if(message.content.split(' ')[1] > maxPage){
        message.reply("There is only " + maxPage+ " pages :(");
        return;
      }
    }
    //var msg = '';
    var msg = [];
    for(var i = (10 * page) - 10; i < instructions.length &&  i < (10 * page); i++){
      //msg += ('_' + i + '._ ' +  '``' + prefix + instructions[i][0].name + "`` _" + instructions[i][1] + '_\n\n');
      let arguments = "";
      instructions[i][1].arguments.forEach(argument =>
      {
        arguments += " [" + argument + "] ";
      });
      arguments = arguments.substring(0, arguments.length -1);
      let command = {"name": i + ' ``' + prefix + instructions[i][0].name + arguments + "``","value":instructions[i][1].explanation};
      msg.push(command);
    }
    //msg = msg.substring(0,msg.length - 3);
    message.reply({ embed: buildEmbed(msg, page, maxPage)}).catch();
  },

  changeCommands: function (message, prefix, instructions){
    var msg = message.content.split(' ');
    // Syntax für 'set' Befehl ist nicht korrekt
    if(msg.length !== 3 || msg[1] < 0 || msg[1] >= instructions.length){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#BF616A;'>FEHLER</span>: Der Befehl konnte nicht umbenannt werden (Fehlerhafte Argumente).");
      return 'Incorrect usage of \'' + prefix + instructions[17][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax.';
    }

    if(contains(instructions, msg[2])){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Befehl konnte nicht umbenannt werden (Den Namen gibt es schon).");
      return 'Incorrect usage of \'' + prefix + instructions[17][0] + '\', the alias \'' + msg[2] + '\' does already exist.';
    }

    if(msg[2].length > 40){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Befehl konnte nicht umbenannt werden (Der Name ist zu lang).");
      return 'Incorrect usage of \'' + prefix + instructions[17][0] + '\', the alias is too long.';
    }

    var oldBefehl = instructions[msg[1]][0].name;
    instructions[msg[1]][0].name = msg[2];
    serverManager.setInstructions(message.guild.id, instructions);
    logManager.writeDebugLog(message.guild.name + ": Der Befehl: " + oldBefehl + " wurde zu: " + msg[2] + " umbennant.");
    return 'The alias \'' + prefix + oldBefehl + '\' has been changed to \'' + prefix + msg[2] + '\'';

  },

  changePrefix: function (message, prefix, instructions){
    var param = message.content.split(' ');
    if(param.length != 2 || param[1].length != 1){
      message.reply('Incorrect usage of \'' +  prefix +  instructions[16][0].name + '\', type \'' + prefix + instructions[8][0].name + '\' for the correct syntax.');
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Präfix konnte nicht geändert werden (Fehlerhafte Argumente).");
      return null;
    }
    logManager.writeDebugLog(message.guild.name + ": Der Präfix wurde erfolgreich auf: \"" + param[1] + "\" gesetzt.");
    message.reply('The prefix has been updated succesfully to \'' + param[1] + '\'.');
    return param[1];
  },

  setVolume: function(message){
    var param = message.content.split(' ');
    //Ungültige Anzahl an Argumenten
    if (param.length != 2){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Lautstärke konnte nicht geändert werden (Fehlerhafte Argumente).");
      message.reply("Incorrect input...");
      return;
    }

    //Keine Nummer
    try{
      volume = parseInt(param[1]);
      //Nummer nicht im gültigen bereich
      if (volume < 0 || volume > 100){
        logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Lautstärke konnte nicht geändert werden (Fehlerhafte Argumente).");
        message.reply("The volume must be beteween 0 and 100.");
        return;
      }

      serverManager.setVolume(message.guild.id, volume / 100.0);
      logManager.writeDebugLog(message.guild.name + ": Die Lautstärke wurde erfolgreich auf " + volume + "% gesetzt.");
      message.reply("The volume has been set to " + volume +"%.");
    }
    catch(e){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Lautstärke konnte nicht geändert werden (Fehlerhafte Argumente).");
      message.reply("The volume has to be a whole number! " + e);
      return;
    }

  },

  getVolume: function(message){
    return serverManager.getVolume(message.guild.id);
  }
}
