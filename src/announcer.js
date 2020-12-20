//Import Modules
const errorManager = require('./includes/errorManager.js');
const connectionManager = require('./includes/connectionManager.js');
const interactionManager = require('./includes/interactionManager.js');
const roleManager = require('./includes/roleManager.js');
const lockManager = require('./includes/lockManager.js');
const reactionManager = require('./includes/reactionManager.js');
const serverManager = require('./includes/serverManager.js');
const logManager = require('./includes/logManager.js');
const vipManager = require('./includes/vipManager.js');
const whitelistManager = require('./includes/whitelistManager.js');

const dbManager = require('./includes/databaseManager.js');

process.on('uncaughtException', function(err) {
  logManager.writeErrorLog(err);
  logManager.writeErrorLog(err.stack);
  process.exit();
});

process.on('warning', function(warning) {
  logManager.writeErrorLog(warning);
  logManager.writeErrorLog(warning.stack);
});

dbManager.getVip('174558221535674369', function(out){
  logManager.writeDebugLog(JSON.stringify(out));
});

//Initilizing BOT
const Discord = require('discord.js');
const client = new Discord.Client();
const KEY = process.argv.slice(2)[0];
const JOIN = false;
const REACTION = true;
const ENDUNGEN = [
  ".3gp",
  ".aac",
  ".flac",
  ".m4a",
  ".m4b",
  ".m4p",
  ".msv",
  ".ogg",
  ".oga",
  ".opus",
  ".wav",
  ".wma",
  ".webm",
  ".aa"
];


logManager.writeBootLog("Logge den Bot ein...");
//BOT booten
client.login(KEY);
logManager.writeBootLog("<span style='color:#22c722;'>[SUCCESS]</span> Login erfolgreich.");

logManager.writeBootLog("Warte auf Readyness des Bots...");
//Set Status
client.on('ready', () =>{
  logManager.writeBootLog("<span style='color:#22c722;'>[SUCCESS]</span> Bot bereit. Beginne Systemprozesse");
  //Fetch all existing Servers and their settings
  logManager.writeBootLog("Beginne mit dem Einlesen der Server...");
  serverManager.readInServers(client);
  serverManager.updateUser(client);
  client.user.setActivity("v1.0", {
    type: "STREAMING",
    url: "https://www.twitch.tv/jako9"
  });
  logManager.writeBootLog("------------------------------");
});

//Füge den neuen Server der Datenbank hinzu
client.on("guildCreate", guild => {
  serverManager.addServer(guild);
});

//Löscht den Server aus der Datenbank
client.on("guildDelete", guild => {
  serverManager.removeServer(guild);
});

// Join Automatisch
client.on('voiceStateUpdate', (oldState, newState) => {
  //Fetch roles in case they are needed (on voiceChannelJoinEvent)
  let rolle = newState.channel == null ? null : serverManager.getRolle(newState.channel.guild.id);
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

  // DM => becomeVIP Regelung
  if (!message.guild) {
    if(message.content.startsWith('Er9')){
      errorManager.er9(message,client);
    }
    else if(message.content === "becomeVIP"){
      vipManager.becomeVIP(message);
    }
    else if(message.attachments.size == 1){
      let attachment = message.attachments.find(foo => true);
      ENDUNGEN.forEach(endung => {
        if(attachment.proxyURL.endsWith(endung)){
          message.author.send("The joinsound must be an mp3!");
        }
      });
      if(attachment.proxyURL.endsWith(".mp3")){
        vipManager.fileReceived(message, attachment);
      }
    }
    return;
  }
  //Fetch atrributes for current guild
  var id = message.guild.id;
  var prefix = serverManager.getPrefix(id);
  var instructions = serverManager.getInstructions(id)

  //Channel ist nicht gewhitelisted
  if(!whitelistManager.isValid(message)) return;

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
  else  if(message.content.startsWith(prefix + instructions[4][0])){
    message.reply(interactionManager.help(message, prefix, instructions));
  }

  // Personalisiere Befehle mit 'set'
  else  if(message.content.startsWith(prefix + instructions[5][0]  + ' ')){
    message.reply(interactionManager.changeCommands(message, prefix, instructions));
  }

  // Aktive Rolle ändern
  else if (message.content.startsWith(prefix + instructions[6][0]  + ' ')) {
    roleManager.changeRole(message, JOIN, prefix, instructions);
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
    reactionManager.setupListener(message, client, prefix, instructions);
  }

  //Reaction Emojis
  else if(message.content.startsWith(prefix + instructions[12][0])){
    reactionManager.addReactor(message);
  }

  //change Reaction Role
  else if(message.content.startsWith(prefix + instructions[13][0])){
    roleManager.changeRole(message, REACTION, prefix, instructions);
  }

  //show Reaction role
  else if(message.content.startsWith(prefix + instructions[14][0])){
    roleManager.showReactionRole(message);
  }

  //becomeVIP
  else if(message.content === prefix + instructions[15][0]){
    vipManager.becomeVIP(message);
  }

  //showWhitelist
  else if(message.content === prefix + instructions[16][0]){
    whitelistManager.show(message);
  }

  //whitelistAdd
  else if(message.content.startsWith(prefix + instructions[17][0])){
    whitelistManager.addElem(message, prefix, instructions);
  }

  //whitelistRemove
  else if(message.content.startsWith(prefix + instructions[18][0])){
    whitelistManager.removeElem(message, prefix, instructions);
  }

  //whitelistClear
  else if(message.content == (prefix + instructions[19][0])){
    whitelistManager.clear(message);
  }

  //play
  else if(message.content.startsWith(prefix + instructions[20][0])){
    connectionManager.play(message, prefix, instructions);
  }

  //setJoinSound
  else if(message.content.startsWith(prefix + instructions[21][0])){
    connectionManager.setJoinSound(message, prefix, instructions);
  }

  //removeJoinSound
  else if(message.content == (prefix + instructions[22][0])){
    connectionManager.removeJoinSound(message);
  }

  // Falsche Eingabe
  else if(message.content.startsWith(prefix)){
    message.reply('Diesen Befehl kenne ich leider nicht :(   Tippe \'' + prefix + instructions[4][0] + '\' für eine Liste aller Befehle!');
  }
});
