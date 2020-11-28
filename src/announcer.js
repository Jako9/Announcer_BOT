//Imports
errorManager = require('./includes/errorManager.js');
connectionManager = require('./includes/connectionManager.js');
interactionManager = require('./includes/interactionManager.js');
roleManager = require('./includes/roleManager.js');
lockManager = require('./includes/lockManager.js');
reactionManager = require('./includes/reactionManager.js');


//Initialisierung
const Discord = require('discord.js');
const client = new Discord.Client();
const args = process.argv.slice(2);
const KEY = args[0];

//Setup
var prefix = '.';


//Feld der Rollen, die den Bot auslösen
var rollen = [
  'Die Nerds',
  'Knights of the round Table',
  'Hömma!',
  'angesagt'
];

// Format: [USER_ID, SONG_PFAD]


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
  ['setChannel', ' Setting the Channel that is being listened to the desired Channel. \n Syntax: setChannel [CHANNEL_ID]'],
  ['addReaction', 'Adding Reactions to the Role-Reaction Message. \n  Syntax: addReaction [LIST OF REACTION_NAME]']
];

//BOT booten
client.login(KEY);


//Nachrichten für Reaktionen fetchen
client.on('ready', () =>{

  reactionManager.setupReaction(client);

  //Setup Status
  client.user.setActivity("....", {
    type: "STREAMING",
    url: "https://www.twitch.tv/jako9"
  });
});


// Join Automatisch
client.on('voiceStateUpdate', (oldState, newState) => {
  connectionManager.triggerJoin(oldState,newState,rollen);
});

//Rolle per Reaktion bekommen
client.on('messageReactionAdd', (reaction, user) => {
  reactionManager.giveReaction(reaction, user);
});

//Rolle per Reaktion abgeben
client.on('messageReactionRemove', (reaction, user) => {
  reactionManager.removeReaction(reaction, user);
});


// BEFEHL-ABFRAGE
client.on('message', message => {

  // Error Handling
  if (!message.guild && message.content.startsWith('Er9')) {
    errorManager.er9(message,client);
    return;
  }

  //DMs an den Bot filtern
  else if(!message.guild){
    return;
  }

  // Join per Befehl
  else if (message.content === prefix + instructions[0][0]) {
    // Wenn in einem gültigen Channel, join
    message.member.voice.channel ? connectionManager.triggerJoin(null, message.member.voice,rollen) : message.reply('Betrete erst nen Channel, du Bob!');

  }

  // Leave per Befehl
  else if (message.content === prefix + instructions[1][0]) {
    connectionManager.triggerLeave(message);
  }

  //  Help -- ALLE  BEFEHLE GELISTET
  else  if(message.content === prefix + instructions[2][0]){
    interactionManager.help(message, prefix, instructions);
  }

  // Personalisiere Befehle mit 'set'
  else  if(message.content.startsWith(prefix + instructions[3][0]  + ' ')){
    interactionManager.changeCommands(message, prefix, instructions);
  }

  // Neue Rolle adden
  else if (message.content.startsWith(prefix + instructions[4][0]  + ' ')) {
    roleManager.addRole(message, rollen, prefix, instructions);
  }

  // Rolle löschen
  else if (message.content.startsWith(prefix + instructions[5][0]  + ' ')) {
    roleManager.removeRole(message, rollen, prefix, instructions);
  }

  // Alle aktiven Rollen  anzeigen
  else if (message.content === prefix + instructions[6][0]){
    roleManager.showRoles(message, rollen);
  }

  // Präfix ändern
  else if(message.content.startsWith(prefix + instructions[7][0]  + ' ')){
    let newPrefix = interactionManager.changePrefix(message, prefix);
    prefix = newPrefix == null ? prefix : newPrefix;
  }

  // Lock Room
  else if(message.content.startsWith(prefix + instructions[8][0])){
    lockManager.lock(message);
  }

  // Unlock Room
  else if(message.content.startsWith(prefix + instructions[9][0])){
    lockManager.unlock(message);
  }

  //Reaction Listener
  else if(message.content.startsWith(prefix + instructions[10][0])){
    reactionManager.setupListener(message, client);
  }

  //Reaction Emojis
  else if(message.content.startsWith(prefix + instructions[11][0])){
    reactionManager.addReactor(message);
  }

  // Falsche Eingabe
  else if(message.content.startsWith(prefix)){
    message.reply('Diesen Befehl kenne ich leider nicht :(   Tippe \'' + prefix + instructions[2][0] + '\' für eine Liste aller Befehle!');
  }
});
