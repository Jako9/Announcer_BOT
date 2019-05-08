const Discord = require('discord.js');
const client = new Discord.Client();
const volume = 0.2;
const args = process.argv.slice(2);
const KEY = args[1];
const bot_id = args[2];
var prefix = '.'

//Feld der Rollen, die den Bot auslösen
var rollen = ['Die Nerds', 'Knights of the round Table'];
var vip = [['278573049287278592', './vips/joshua.mp3']
];

//Sound Files
const login_sound = './Avengers_Suite.wav';
const comeback_sound = './Avengers_Suite.wav';

//Feld der Standartbefehle mit der jeweiligen Beschriebung
var instructions  = [
  ['join', ' to manually connect the bot. \n(Could be used for a different \'comeback\' sound when you were just afk)'],
  ['leave', ' to manually disconnect the bot.'],
  ['help', ' to get some help ;)'],
  ['set', ' set  the command COMMAND_ID to be NEW_COMMAND. \n(where COMMAND_ID is an Integer between 0 and 3 and NEW_COMMAND is the new alias)\n-> Syntax: set COMMAND_ID NEW_COMMAND'],
  ['addRole', ' to add a new Role which triggers the bot\n-> Syntax: addRole ROLENAME'],
  ['removeRole', ' to remove an old Role which triggers the bot\n-> Syntax: removeRole ROLEPOSITION'],
  ['showRoles', ' to see a list of all currently active roles.'],
  ['setPrefix', ' to update the prefix.\n-> Syntax: setPrefix PREFIX']
];


client.login(KEY);

// per Befehl
client.on('message', message => {

  // Wenn nicht auf einem Server
  if (!message.guild) return;

  // Join
  else if (message.content === prefix + instructions[0][0]) {
    var vs = message.member.voiceChannel;

    // Wenn in einem gültigen Channel, join
    if (vs) {
      vs.join().then(connection => bot_join(vs, connection, comeback_sound)).catch(console.log);
    }

    //Wenn in keinem gültigen Channel
    else {
      message.reply('Betrete erst nen Channel, du Bob!');
    }
  }


  // Leave
  else if (message.content === prefix + instructions[1][0]) {
    leave(message);
  }


  //  Help -- ALLE  BEFEHLE GELISTET
  else  if(message.content === prefix + instructions[2][0]){
    var msg = '``` \n------------------------------------------------------------- \n' +
    'The bot should connect and disconnect automatically but if there are ' +
    'any problems \nor if you want to customize usage you can use the following commands' +
    ' \n------------------------------------------------------------- \n  \n';
    for(var i = 0; i < instructions.length; i++){
      msg += ('[' + i + '] ' +  '\'' + prefix + instructions[i][0] + '\'' + instructions[i][1] + '\n \n');
    }
    message.reply(msg + '```');
  }


  // Personalisiere Befehle mit 'set'
  else  if(message.content.startsWith(prefix + instructions[3][0]  + ' ')){
    var msg = message.content.split(' ');

    // Syntax für 'set' Befehl ist korrekt
    if(msg.length === 3 && msg[1] >= 0 && msg[1] < instructions.length){
      var oldBefehl = instructions[msg[1]][0];
      instructions[msg[1]][0] = msg[2];
      message.reply('Der Befehl \'' + prefix + oldBefehl + '\' heißt nun \'' + prefix + msg[2] + '\'');
    }
    else{
        message.reply('Ungültige Eingabe für \'' + prefix + instructions[3][0] + '\', schreibe \'' + prefix +  instructions[2][0] + '\' für korrekte Syntax.');
      }
  }


  // Neue Rolle adden
  else if (message.content.startsWith(prefix + instructions[4][0]  + ' ')) {
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
          if(message.guild.roles.find(role => role.name === tmpMessage) !== null){
            rollen.push(tmpMessage);
            message.reply('Die Rolle \'' + tmpMessage + '\' wurde erfolgreich hinzugefügt');
          }
          else{
            message.reply('Die Rolle \'' + tmpMessage + '\' existiert nicht!');
          }
        }
        else{
          message.reply('Die Rolle \'' + tmpMessage + '\' inspect schon aktiv du Kek!');
        }
      }
      else{
        message.reply('Es dürfen maximal 40 Rollen gleichzeitig aktiv sein!');
      }
    }
    else{
      message.reply('Ungültige Eingabe für \'' + prefix +  instructions[4][0] + '\', schreibe \'' + prefix +  instructions[2][0] + '\' für korrekte Syntax.');
    }
  }


  // Rolle löschen
  else if (message.content.startsWith(prefix + instructions[5][0]  + ' ')) {
    if(message.content.split(' ').length == 2 && message.content.split(' ')[1] >= 0 && message.content.split(' ')[1] < rollen.length){
      var tmpRolle = rollen.splice(message.content.split(' ')[1], 1);
      message.reply('Die Rolle \'' + tmpRolle + '\' wurde erfolgreich entfernt');
    }
    else{
      message.reply('Ungültige Eingabe für \'' + prefix +  instructions[5][0] + '\', schreibe \'' + prefix + instructions[2][0] + '\' für korrekte Syntax.');
    }
  }


  // Alle aktiven Rollen  anzeigen
  else if (message.content === prefix + instructions[6][0]){
    var alleRollen = '```';
    for(var i = 0; i < rollen.length; i++){
      alleRollen += i + ' ' + rollen[i] + '\n';
    }
    alleRollen += '```';
    rollen.length != 0? message.reply(alleRollen) :  message.reply('Es gibt  aktuell keine aktiven Rollen!');
  }


  // Präfix ändern
  else if(message.content.startsWith(prefix + instructions[7][0]  + ' ')){
    if(message.content.split(' ').length == 2){
      prefix = message.content.split(' ')[1];
      message.reply('Der neue Präfix wurde erfolgreich auf \'' + prefix + '\' gesetzt');
    }
    else{
      message.reply('Ungültige Eingabe für \'' +  prefix +  instructions[7][0] + '\', schreibe \'' + prefix + instructions[2][0] + '\' für korrekte Syntax.');
    }
  }

  // Falsche Eingabe
  else if(message.content.startsWith(prefix)){
    message.reply('Diesen Befehl kenne ich leider nicht :(   Tippe \'' + prefix + instructions[2][0] + '\' für eine Liste aller Befehle!');
  }

});


// per Join und Leave Benutzer
client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

  if(oldUserChannel === undefined && newUserChannel !== undefined) {

    // User Joins a voice channel
    for(var i = 0;  i < rollen.length; i++){
      let role = newMember.guild.roles.find(role => role.name === rollen[i]);
      if(role != null){
        if(newMember.roles.has(role.id) && !isVip(newMember.id)[0]) {

          //Nutzer hat einer der validen Rollen
          newUserChannel.join().then(connection => bot_join(newUserChannel, connection, login_sound));
          break;
        }
      }
    }

    //Prüft, ob der Member  ein  VIP ist und somit seinen eigenen Sound  bekommt
    if(isVip(newMember.id)[0]){
      newUserChannel.join().then(connection => bot_join(newUserChannel, connection, isVip(newMember.id)[1]));
    }
  } else if(newUserChannel === undefined){

    //  User Leaves a voice channel
  }
});

//Gibt wieder, ob die Person ein VIP ist
function isVip(userID){
  for(i = 0; i < vip.length; i++){
    if(vip[i][0] == userID){
      return [true, vip[i][1]];
    }
  }
  return [false];
}


// Ton spielen wenn bereit und danach den Channel wieder verlassen
function bot_join(vc, connection, file){
  const dispatcher = connection.playFile(file);
  dispatcher.setVolume(volume);
  dispatcher.on("end", end => leave(vc));
}


// Bot Server verlassen
function leave(guildFeeder){
  if(guildFeeder.guild.members.find(member => member.id === bot_id).voiceChannel != null){
    guildFeeder.guild.members.find(member => member.id === bot_id).voiceChannel.leave();
  }
}
