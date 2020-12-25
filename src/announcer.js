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

process.on('uncaughtException', async function(err) {
  let arr = client.guilds.cache.array();
  for(let i = 0; i < arr.length; i++){
    await lockManager.crashUnlock(arr[i].id);
  }
  logManager.writeErrorLog(err);
  logManager.writeErrorLog(err.stack);

  process.exit();
});

process.on('warning', function(warning) {
  logManager.writeErrorLog(warning);
  logManager.writeErrorLog(warning.stack);
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
  serverManager.readInDescriptions();
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

  if(oldState.channel !== undefined){
    lockManager.forceUnlock(oldState);
  }
});

//Rolle per Reaktion bekommen
client.on('messageReactionAdd', (reaction, user) => {
  reactionManager.giveReaction(reaction, user);
});

//Rolle per Reaktion abgeben
client.on('messageReactionRemove', (reaction, user) => {
  reactionManager.removeReaction(reaction, user);
});


hasAccessRights = function(member, level){
  switch (level) {
    //Lowlever => Jeder hat Zugriff
    case 0:
      logManager.writeDebugLog("Berechtigung 0 erkannt");
      return true;
    //Moderat: Nur Admins oder Manager dürfen diesen Befehl benutzen
    case 1:
      logManager.writeDebugLog("Berechtigung 1 erkannt");
      if(member.hasPermission(ADMINISTRATOR)) return true;
      return member.roles.cache.get(serverManager.getRolle(message.guild.id)) != undefined;
    //HighSec => Nur Admins dürfen diesen Befehl verwenden
    case 2:
      logManager.writeDebugLog("Berechtigung 2 erkannt");
      return member.hasPermission(ADMINISTRATOR);
    //Sollte nicht passieren
    default:
    logManager.writeDebugLog("Keine Berechtigung erkannt");
      return false;

  }
}


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
  var instructions = serverManager.getInstructions(id);

  //Channel ist nicht gewhitelisted
  if(!whitelistManager.isValid(message)) return;

  // Join per Befehl
  if (message.content === prefix + instructions[0][0].name) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[0][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[0][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    // Wenn in einem gültigen Channel, join
    message.member.voice.channel ? connectionManager.triggerJoin({"connection" : null}, message.member.voice,serverManager.getRolle(id)) : message.reply('Betrete erst nen Channel, du Bob!');
  }

  // Leave per Befehl
  else if (message.content === prefix + instructions[1][0].name) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[1][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[1][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    connectionManager.triggerLeave(message);
  }

  // setVolume
  else if (message.content.startsWith(prefix + instructions[2][0].name)) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[2][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[2][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    interactionManager.setVolume(message);
  }

  // getVolume
  else if (message.content === prefix + instructions[3][0].name) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[3][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[3][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    message.reply("Die Lautstärke ist auf " + (100 * interactionManager.getVolume(message)) + "%.");
  }

  //  Help -- ALLE  BEFEHLE GELISTET
  else  if(message.content.startsWith(prefix + instructions[4][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[4][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[4][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    message.reply(interactionManager.help(message, prefix, instructions));
  }

  // Personalisiere Befehle mit 'set'
  else  if(message.content.startsWith(prefix + instructions[5][0].name  + ' ')){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[5][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[5][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    message.reply(interactionManager.changeCommands(message, prefix, instructions));
  }

  // Aktive Rolle ändern
  else if (message.content.startsWith(prefix + instructions[6][0].name  + ' ')) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[6][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[6][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    roleManager.changeRole(message, JOIN, prefix, instructions);
  }

  // Aktive Rolle anzeigen
  else if (message.content === prefix + instructions[7][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[7][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[7][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    message.reply(roleManager.showRole(serverManager.getRolle(id)));
  }

  // Präfix ändern
  else if(message.content.startsWith(prefix + instructions[8][0].name  + ' ')){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[8][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[8][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    let newPrefix = interactionManager.changePrefix(message, prefix, instructions);
    if (newPrefix != null) serverManager.setPrefix(id, newPrefix);
  }

  // Lock Room
  else if(message.content === prefix + instructions[9][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[9][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[9][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    lockManager.lock(message);
  }

  // Unlock Room
  else if(message.content === prefix + instructions[10][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[10][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[10][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    lockManager.unlock(message);
  }

  //Reaction Listener
  else if(message.content.startsWith(prefix + instructions[11][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[11][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[11][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    reactionManager.setupListener(message, client, prefix, instructions);
  }

  //Reaction Emojis
  else if(message.content.startsWith(prefix + instructions[12][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[12][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[12][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    reactionManager.addReactor(message);
  }

  //change Reaction Role
  else if(message.content.startsWith(prefix + instructions[13][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[13][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[13][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    roleManager.changeRole(message, REACTION, prefix, instructions);
  }

  //show Reaction role
  else if(message.content === prefix + instructions[14][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[14][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[14][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    roleManager.showReactionRole(message);
  }

  //becomeVIP
  else if(message.content === prefix + instructions[15][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[15][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[15][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    vipManager.becomeVIP(message);
  }

  //showWhitelist
  else if(message.content === prefix + instructions[16][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[16][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[16][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    whitelistManager.show(message);
  }

  //whitelistAdd
  else if(message.content.startsWith(prefix + instructions[17][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[17][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[17][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    whitelistManager.addElem(message, prefix, instructions);
  }

  //whitelistRemove
  else if(message.content.startsWith(prefix + instructions[18][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[18][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[18][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    whitelistManager.removeElem(message, prefix, instructions);
  }

  //whitelistClear
  else if(message.content === prefix + instructions[19][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[19][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[19][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    whitelistManager.clear(message);
  }

  //play
  else if(message.content.startsWith(prefix + instructions[20][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[20][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[20][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    connectionManager.play(message, prefix, instructions);
  }

  //setJoinSound
  else if(message.content.startsWith(prefix + instructions[21][0].name)){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[21][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[21][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    connectionManager.setJoinSound(message, prefix, instructions);
  }

  //removeJoinSound
  else if(message.content === prefix + instructions[22][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[22][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[22][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    connectionManager.removeJoinSound(message);
  }

  //lockable
  else if(message.content === prefix + instructions[23][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[23][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[23][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    lockManager.showLockable(message);
  }

  //lockableAdd
  else if(message.content === prefix + instructions[24][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[24][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[24][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    lockManager.addLockable(message);
  }

  //lockableRemove
  else if(message.content === prefix + instructions[25][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[25][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[25][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    lockManager.removeLockable(message);
  }

  //lockableClear
  else if(message.content === prefix + instructions[26][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[26][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[26][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    lockManager.lockableClear(message);
  }

  //showChannelReact
  else if(message.content === prefix + instructions[27][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[27][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[27][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    reactionManager.showChannelReact(message);
  }

  //removeChannelReact
  else if(message.content === prefix + instructions[28][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[28][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[28][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    reactionManager.removeChannelReact(message);
  }

  //removeReactionRole
  else if(message.content === prefix + instructions[29][0].name){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message.member, instructions[29][0].security)){
      message.reply("Du hast nicht die Berechtigung [LEVEL" + instructions[29][0].security + "] um auf diesen Befehl zuzugreifen.");
      return;
    }
    roleManager.removeReactionRole(message);
  }

  // Falsche Eingabe
  else if(message.content.startsWith(prefix)){
    message.reply('Diesen Befehl kenne ich leider nicht :(   Tippe \'' + prefix + instructions[4][0].name + '\' für eine Liste aller Befehle!');
  }
});
