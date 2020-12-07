//Import Modules
const errorManager = require('./includes/errorManager.js');
const connectionManager = require('./includes/connectionManager.js');
const interactionManager = require('./includes/interactionManager.js');
const roleManager = require('./includes/roleManager.js');
const lockManager = require('./includes/lockManager.js');
const reactionManager = require('./includes/reactionManager.js');
const serverManager = require('./includes/serverManager.js');
const logManager = require('./includes/logManager.js');

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
  serverManager.updateUser(client);
  client.user.setActivity("zZZZZ", {
    type: "STREAMING",
    url: "https://www.twitch.tv/jako9"
  });
});

//Füge den neuen Server der Datenbank hinzu
client.on("guildCreate", guild => {
  serverManager.addServer(guild);
});

//Löscht den Server aus der Datenbank
client.on("guildRemove", guild => {
  serverManager.removeServer(guild.id);
});

// Join Automatisch
client.on('voiceStateUpdate', (oldState, newState) => {
  //Fetch roles in case they are needed (on voiceChannelJoinEvent)
  var rolle = newState.channel == null ? null : serverManager.getRolle(newState.channel.guild.id);
  connectionManager.triggerJoin(oldState,newState,rolle);
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
    message.member.voice.channel ? connectionManager.triggerJoin({"connection" : null}, message.member.voice,serverManager.getRolle(id)) : message.reply('Betrete erst nen Channel, du Bob!');
  }

  // Leave per Befehl
  else if (message.content === prefix + instructions[1][0]) {
    connectionManager.triggerLeave(message);
  }

  // setVolume
  else if (message.content.startsWith(prefix + instructions[2][0])) {
    interactionManager.setVolume(message);
  }

  // getVolume
  else if (message.content === prefix + instructions[3][0]) {
    message.reply("Die Lautstärke ist auf " + (100 * interactionManager.getVolume(message)) + "%.");
  }


  //  Help -- ALLE  BEFEHLE GELISTET
  else  if(message.content === prefix + instructions[4][0]){
    message.reply(interactionManager.help(prefix, instructions));
  }

  // Personalisiere Befehle mit 'set'
  else  if(message.content.startsWith(prefix + instructions[5][0]  + ' ')){
    message.reply(interactionManager.changeCommands(message, prefix, instructions));
  }

  // Aktive Rolle ändern
  else if (message.content.startsWith(prefix + instructions[6][0]  + ' ')) {
    roleManager.changeRole(message, prefix, instructions);
  }

  // Aktive Rolle anzeigen
  else if (message.content === prefix + instructions[7][0]){
    message.reply(roleManager.showRole(serverManager.getRolle(id)));
  }

  // Präfix ändern
  else if(message.content.startsWith(prefix + instructions[8][0]  + ' ')){
    let newPrefix = interactionManager.changePrefix(message, prefix, instructions);
    if (newPrefix != null) serverManager.setPrefix(id, newPrefix);
  }

  // Lock Room
  else if(message.content.startsWith(prefix + instructions[9][0])){
    lockManager.lock(message);
  }

  // Unlock Room
  else if(message.content.startsWith(prefix + instructions[10][0])){
    lockManager.unlock(message);
  }

  //Reaction Listener
  else if(message.content.startsWith(prefix + instructions[11][0])){
    reactionManager.setupListener(message, client);
  }

  //Reaction Emojis
  else if(message.content.startsWith(prefix + instructions[12][0])){
    reactionManager.addReactor(message);
  }

  //change Reaction Role
  else if(message.content.startsWith(prefix + instructions[13][0])){
  }

  //show Reaction role
  else if(message.content.startsWith(prefix + instructions[14][0])){
    roleManager.showReactionRole(message);
  }

  // Falsche Eingabe
  else if(message.content.startsWith(prefix)){
    message.reply('Diesen Befehl kenne ich leider nicht :(   Tippe \'' + prefix + instructions[2][0] + '\' für eine Liste aller Befehle!');
  }
});
