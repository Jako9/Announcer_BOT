//Import Modules
const errorManager = require('./includes/errorManager.js');
const connectionManager = require('./includes/connectionManager.js');
const interactionManager = require('./includes/interactionManager.js');
const roleManager = require('./includes/roleManager.js');
const lockManager = require('./includes/lockManager.js');
const reactionManager = require('./includes/reactionManager.js');
const serverManager = require('./includes/serverManager.js');

//Initilizing BOT
const Discord = require('discord.js');
const client = new Discord.Client();
const KEY = process.argv.slice(2)[0];

//BOT booten
client.login(KEY);

//Set Status
client.on('ready', () =>{
  //Fetch all existing Servers and their settings
  serverManager.readInServers(client);
  client.user.setActivity("zZZZZ...", {
    type: "STREAMING",
    url: "https://www.twitch.tv/jako9"
  });
});

//Füge den neuen Server der Datenbank hinzu
client.on("guildCreate", guild => {
  serverManager.addServer(guild.id);
});

//Löscht den Server aus der Datenbank
client.on("guildRemove", guild => {
  serverManager.removeServer(guild.id);
});

// Join Automatisch
client.on('voiceStateUpdate', (oldState, newState) => {
  //Fetch roles in case they are needed (on voiceChannelJoinEvent)
  var rollen = newState.channel == null ? null : serverManager.getRollen(newState.channel.guild.id);
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
  if (!message.guild) {
    if(message.content.startsWith('Er9')){
      errorManager.er9(message,client);
    }
    return;
  }

  //Fetch atrributes for current guild
  var id = message.guild.id;
  var prefix = serverManager.getPrefix(id);
  var instructions = serverManager.getInstructions(id)

  // Join per Befehl
  if (message.content === prefix + instructions[0][0]) {
    // Wenn in einem gültigen Channel, join
    message.member.voice.channel ? connectionManager.triggerJoin({"connection" : null}, message.member.voice,serverManager.getRollen(id)) : message.reply('Betrete erst nen Channel, du Bob!');
  }

  // Leave per Befehl
  else if (message.content === prefix + instructions[1][0]) {
    connectionManager.triggerLeave(message);
  }

  //  Help -- ALLE  BEFEHLE GELISTET
  else  if(message.content === prefix + instructions[2][0]){
    message.reply(interactionManager.help(prefix, instructions));
  }

  // Personalisiere Befehle mit 'set'
  else  if(message.content.startsWith(prefix + instructions[3][0]  + ' ')){
    message.reply(interactionManager.changeCommands(message, prefix, instructions));
  }

  // Neue Rolle adden
  else if (message.content.startsWith(prefix + instructions[4][0]  + ' ')) {
    roleManager.addRole(message, serverManager.getRollen(id), prefix, instructions);
  }

  // Rolle löschen
  else if (message.content.startsWith(prefix + instructions[5][0]  + ' ')) {
    roleManager.removeRole(message, serverManager.getRollen(id), prefix, instructions);
  }

  // Alle aktiven Rollen  anzeigen
  else if (message.content === prefix + instructions[6][0]){
    message.reply(roleManager.showRoles(serverManager.getRollen(id)));
  }

  // Präfix ändern
  else if(message.content.startsWith(prefix + instructions[7][0]  + ' ')){
    let newPrefix = interactionManager.changePrefix(message, prefix, instructions);
    if (newPrefix != null) serverManager.setPrefix(id, newPrefix);
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
