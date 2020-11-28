//Imports
const errorManager = require('./includes/errorManager.js');
const connectionManager = require('./includes/connectionManager.js');
const interactionManager = require('./includes/interactionManager.js');
const roleManager = require('./includes/roleManager.js');
const lockManager = require('./includes/lockManager.js');
const reactionManager = require('./includes/reactionManager.js');
const serverManager = require('./includes/serverManager.js');

//Initialisierung
const Discord = require('discord.js');
const client = new Discord.Client();
const KEY = process.argv.slice(2)[0];


serverManager.readInServers();

//BOT booten
client.login(KEY);


//Nachrichten für Reaktionen fetchen
client.on('ready', () =>{
  //Setup Status
  client.user.setActivity("....", {
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
  if (!message.guild && message.content.startsWith('Er9')) {
    errorManager.er9(message,client);
    return;
  }

  //DMs an den Bot filtern
  else if(!message.guild){
    return;
  }

  // Join per Befehl
  else if (message.content === serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[0][0]) {
    // Wenn in einem gültigen Channel, join
    message.member.voice.channel ? connectionManager.triggerJoin(null, message.member.voice,serverManager.getRollen(message.guild.id)) : message.reply('Betrete erst nen Channel, du Bob!');
  }

  // Leave per Befehl
  else if (message.content === serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[1][0]) {
    connectionManager.triggerLeave(message);
  }

  //  Help -- ALLE  BEFEHLE GELISTET
  else  if(message.content === serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[2][0]){
    interactionManager.help(message, serverManager.getPrefix(message.guild.id), serverManager.getInstructions(message.guild.id));
  }

  // Personalisiere Befehle mit 'set'
  else  if(message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[3][0]  + ' ')){
    interactionManager.changeCommands(message, serverManager.getPrefix(message.guild.id), serverManager.getInstructions(message.guild.id));
  }

  // Neue Rolle adden
  else if (message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[4][0]  + ' ')) {
    roleManager.addRole(message, serverManager.getRollen(message.guild.id), serverManager.getPrefix(message.guild.id), serverManager.getInstructions(message.guild.id));
  }

  // Rolle löschen
  else if (message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[5][0]  + ' ')) {
    roleManager.removeRole(message, serverManager.getRollen(message.guild.id), serverManager.getPrefix(message.guild.id), serverManager.getInstructions(message.guild.id));
  }

  // Alle aktiven Rollen  anzeigen
  else if (message.content === serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[6][0]){
    roleManager.showRoles(message, serverManager.getRollen(message.guild.id));
  }

  // Präfix ändern
  else if(message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[7][0]  + ' ')){
    let newPrefix = interactionManager.changePrefix(message, serverManager.getPrefix(message.guild.id), serverManager.getInstructions(message.guild.id));
    if (newPrefix != null) serverManager.setPrefix(message.guild.id, newPrefix);
  }

  // Lock Room
  else if(message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[8][0])){
    lockManager.lock(message);
  }

  // Unlock Room
  else if(message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[9][0])){
    lockManager.unlock(message);
  }

  //Reaction Listener
  else if(message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[10][0])){
    reactionManager.setupListener(message, client);
  }

  //Reaction Emojis
  else if(message.content.startsWith(serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[11][0])){
    reactionManager.addReactor(message);
  }

  // Falsche Eingabe
  else if(message.content.startsWith(serverManager.getPrefix(message.guild.id))){
    message.reply('Diesen Befehl kenne ich leider nicht :(   Tippe \'' + serverManager.getPrefix(message.guild.id) + serverManager.getInstructions(message.guild.id)[2][0] + '\' für eine Liste aller Befehle!');
  }
});
