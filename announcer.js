
//Initialisierung
const Discord = require('discord.js');
const client = new Discord.Client();
const args = process.argv.slice(2);
const KEY = args[1];
const bot_id = args[2];

//Setup
var prefix = '.';

//ABschließen
var whoLocked;
var channelSize = 0;

//Announcer
const volume = 0.2;
var timeLastJoin = 0;

//Reaktion
const standartServer = '704731466558603376';
const standartChannel = '704735030521495633';
const standartRole = '704755265735753748';

var channelReact = '704735030521495633';
var reactionMessage;

//Feld der Rollen, die den Bot auslösen
var rollen = [
  'Die Nerds',
  'Knights of the round Table',
  'Hömma!',
  'angesagt'
];

// Format: [USER_ID, SONG_PFAD]
var vip = [
  ['278573049287278592', '/home/fkoehler/bot/vips/joshua.wav'],
  ['244563226711293953', '/home/fkoehler/bot/vips/marie.wav'],
  ['406618328061181952', '/home/fkoehler/bot/vips/sophie.wav'],
  ['235170831095955466', '/home/fkoehler/bot/vips/jonas.wav'],
  ['229322210072985601', '/home/fkoehler/bot/vips/leon.wav'],
  ['174558221535674369', '/home/fkoehler/bot/vips/max.wav'],
  ['346743271738966018', '/home/fkoehler/bot/vips/thomas.wav']
];

//Feld der Rollen, die es erlauben einen Channel abzuschließen
var filme = [
    '697924117197750292'
];
//Sound Files
const login_sound = '/home/fkoehler/bot/Avengers_Suite.wav';
const comeback_sound = '/home/fkoehler/bot/Avengers_Suite.wav';

//Feld der Standartbefehle mit der jeweiligen Beschreibung
//Format: [BEFEHL, BESCHREIBUNG]
var instructions  = [
  ['join', ' to manually connect the bot. \n(Could be used for a different \'comeback\' sound when you were just afk)'],
  ['leave', ' to manually disconnect the bot.'],
  ['help', ' to get some help ;)'],
  ['set', ' set  the command COMMAND_ID to be NEW_COMMAND. \n(where COMMAND_ID is an Integer between 0 and 3 and NEW_COMMAND is the new alias)\n-> Syntax: set COMMAND_ID NEW_COMMAND'],
  ['addRole', ' to add a new Role which triggers the bot\n-> Syntax: addRole ROLENAME'],
  ['removeRole', ' to remove an old Role which triggers the bot\n-> Syntax: removeRole ROLEPOSITION'],
  ['showRoles', ' to see a list of all currently active roles.'],
  ['setPrefix', ' to update the prefix.\n-> Syntax: setPrefix PREFIX'],
  ['lock', ' to lock your current channel (Only one at the same time per Server).'],
  ['unlock', ' to open the currently locked channel.'],
  ['setChannel', ' Setting the Channel that is being listened to the desired Channel. \n Syntax: setupListener [CHANNEL_ID]'],
  ['addReaction', 'Adding Reactions to the Role-Reaction Message. \n  Syntax: setupReaction [LIST OF REACTION_NAME]']
];

//BOT booten
client.login(KEY);


//Nachrichten für Reaktionen fetchen
client.on('ready', () =>{
  let guild = client.guilds.get(standartServer);
  let jonas = guild.members.get('235170831095955466');
  jonas.send('Server ist back on track ;)');
  channelReact = guild.channels.get(standartChannel);
  channelReact.fetchMessages();
  reactionMessage = channelReact.messages.find(foo => true);
});

// BEFEHL-ABFRAGE
client.on('message', message => {



  // Error Handling
  if (!message.guild && message.content.startsWith('Er9')) {
    message.reply('Initializing...');
    let guild;
    let role;
    let user;
    try{
      guild = client.guilds.get(message.content.split(' ')[1]) || client.guilds.find(guild => guild.name === message.content.split(' ')[1]);
      guild.id;
      message.reply('Guild worked');
      role = guild.roles.find(role => (role.id === message.content.split(' ')[2]) || (role.name === message.content.split(' ')[2]));
      role.id;
      message.reply('Role worked');
      user = guild.members.get(message.author.id);
      user.id;
      message.reply('User worked');
    }
    catch(e){
      message.reply('Error: Wrong parameter');
      return;
    }
    message.reply('Checking...');
    message.reply('Guild: ' + guild.id);
    message.reply('Role: ' + role.id);
    message.reply('User: ' + user.id);
    if(!guild.me.hasPermission(["MANAGE_ROLES","ADMINISTRATOR"])){
      message.reply('Error: My permissions on this server are restricted');
      return;
    }
    user.addRole(role.id)
    .then(fun => message.reply('Done!'))
    .catch(err => message.reply(err));
    return;
  }


  // Join per Befehl
  else if (message.content === prefix + instructions[0][0]) {
    var vs = message.member.voiceChannel;
    // Wenn in einem gültigen Channel, join
    if (vs) {
      vs.join().then(connection => bot_join(vs, connection, comeback_sound)).catch(console.log);
    }
    else {
      message.reply('Betrete erst nen Channel, du Bob!');
    }
  }

  // Leave per Befehl
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

  // Lock Room
  else if(message.content.startsWith(prefix + instructions[8][0])){
    if(!message.member.voiceChannel){
      message.reply('Du musst erst einem Channel beitreten, der abgeschlossen werden darf!');
      return;
    }
    if(whoLocked){
      message.reply('Es ist schon abgeschlossen.');
      return;
    }
    lock(message.member);
    //message.reply(filme.some(elem => message.member.voiceChannel.permissionsFor(elem) != null));
    message.reply('Abgeschlossen');
  }

  // Unlock Room
  else if(message.content.startsWith(prefix + instructions[9][0])){
    if(!whoLocked){
      message.reply('Es ist nichts abgeschlossen!');
      return;
    }
    if(message.member != whoLocked){
      message.reply('Du hast nicht abgeschlossen!');
      return;
    }
    unlock(message.member.voiceChannel);
    message.reply('Aufgeschlossen');
  }


  //Reaction Listener
  else if(message.content.startsWith(prefix + instructions[10][0])){
    let msg = message.content.split(' ');
    let channel = client.channels.find(channel => channel.id == msg[1]);
    if(!channel) {
      message.reply('Der Channel konnte nicht gefunden werden');
      return;
    }
    else{
      channelReact = channel;
      channelReact.fetchMessages();
      reactionMessage = channelReact.messages.find(foo => true);
      message.reply('Setup Erfolgreich.');
    }
  }

  //Reaction Emojis
  else if(message.content.startsWith(prefix + instructions[11][0])){
    if(channelReact == null){
      message.reply('Du musst erst einen Channel auswählen.');
      return;
    }
    let msg = message.content.split(' ');
    if(!reactionMessage) return;

    //Geforderte Reaktionen hinzufügen
    for(var i = 1; i < msg.length; i++){
      reactionMessage.react(msg[i]);
    }
    message.reply('Reaktion[en] hinzugefügt.');
  }


  // Falsche Eingabe
  else if(message.content.startsWith(prefix)){
    message.reply('Diesen Befehl kenne ich leider nicht :(   Tippe \'' + prefix + instructions[2][0] + '\' für eine Liste aller Befehle!');
  }
});





// Join Automatisch
client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

  //Es handelt sich um einen Beitritt
  if((oldUserChannel === undefined) && (newUserChannel !== undefined)){
    if((Date.now() - timeLastJoin) > 20000) {
      for(var i = 0;  i < rollen.length; i++){
        let role = newMember.guild.roles.find(role => role.name === rollen[i]);
        if(role != null && !newMember.bot){
          //Rolle spricht den Bot an oder Nutzer ist VIP
          if(newMember.roles.has(role.id) && !isVip(newMember.id)[0]) {
            timeLastJoin = Date.now();
            newUserChannel.join().then(connection => bot_join(newUserChannel, connection, login_sound));
            break;
          }
        }
      }
      //Prüft, ob der Member  ein  VIP ist und somit seinen eigenen Sound  bekommt
      if(isVip(newMember.id)[0]){
        timeLastJoin = Date.now();
        newUserChannel.join().then(connection => bot_join(newUserChannel, connection, isVip(newMember.id)[1]));
      }
    }
  }
  //Es handelt sich um ein Verlassen
  else if((oldUserChannel !== undefined) && (newUserChannel === undefined)){
    //Er hat einen Raum abgeschlossen
    if(whoLocked && (whoLocked === oldMember)){
      unlock(oldMember);
    }
  }
});


//Rolle per Reaktion bekommen
client.on('messageReactionAdd', (reaction, user) => {
  if(user.bot || !channelReact || channelReact != reaction.message.channel) return;
  let roleName = reaction.emoji.name;
  let role = reaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
  let member = reaction.message.guild.members.find(member => member.id === user.id);
  if(!role || !member){
    return;
  }
  let strl = reaction.message.guild.roles.find(role => role.id == standartRole);
  if(strl) member.addRole(strl);
  member.addRole(role.id);

});

//Rolle per Reaktion abgeben
client.on('messageReactionRemove', (reaction, user) => {
  if(user.bot || channelReact != reaction.message.channel) return;
  let roleName = reaction.emoji.name;
  let role = reaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
  let member = reaction.message.guild.members.find(member => member.id === user.id);
  if(!role || !member){
    return;
  }
  member.removeRole(role.id);
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



//Schließt einen Raum (Channel) ab
function unlock(voiceChannel){
  whoLocked = null;
  voiceChannel.setUserLimit(channelSize);
}


//Schließt einen abgeschlossenen Raum (Channel) wieder auf
function lock(member){
  channelSize = member.voiceChannel.userLimit;
  whoLocked = member;
  member.voiceChannel.setUserLimit(1);
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
