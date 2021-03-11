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

const Discord = require('discord.js');
const client = new Discord.Client();

process.on('uncaughtException', async function(err) {
  logManager.writeErrorLog(err);
  logManager.writeErrorLog(err.stack);

  let arr = client.guilds.cache.array();
  for(let i = 0; i < arr.length; i++){
    try{
      await lockManager.crashUnlock(arr[i].id);
    }
    catch(e){
    }
  }

  process.exit();
});

process.on('warning', function(warning) {
  logManager.writeErrorLog(warning);
  logManager.writeErrorLog(warning.stack);
});


//Initilizing BOT

const KEY = process.env.BOTKEY;
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
  client.guilds.cache.array().forEach(guild => {
    serverManager.addServer(guild);
  });
  client.user.setActivity("Test", {
    type: "WATCHING"
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
  try{
    let rolle = newState.channel == null ? null : serverManager.getRolle(newState.channel.guild.id);
    connectionManager.triggerJoin(oldState,newState,rolle);
  }
  catch(e){
    return;
  }

  if(oldState.channel !== undefined){
    try{
      lockManager.forceUnlock(oldState);
      lockManager.removeMember(oldState.member);
    }
    catch(e){
    }
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


hasAccessRights = function(message, level){
  switch (parseInt(level)) {
    //Lowlever => Jeder hat Zugriff
    case 0:
      return true;
    //Moderat: Nur Admins oder Manager dürfen diesen Befehl benutzen
    case 1:
      if(message.member.hasPermission("ADMINISTRATOR")) return true;
      return message.member.roles.cache.get(serverManager.getRolle(message.guild.id).id) != undefined;
    //HighSec => Nur Admins dürfen diesen Befehl verwenden
    case 2:
      return message.member.hasPermission("ADMINISTRATOR");
    //Sollte nicht passieren
    default:
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
    else if(message.content === "restart" && (message.author.id == "255064680417067019" || message.author.id == "174558221535674369")){
      errorManager.restartAnnounce(client);
    }
    else if(message.content === "abort" && (message.author.id == "255064680417067019" || message.author.id == "174558221535674369")){
      errorManager.restartAnnounceRemove(client);
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
  try{
    var prefix = serverManager.getPrefix(id);
    var instructions = serverManager.getInstructions(id);
  }
  catch(e){
    //Falls noch nicht alle Server eingelesen sind
    serverManager.addServer(message.guild);
    return;
  }

  //Channel ist nicht gewhitelisted
  if(!whitelistManager.isValid(message)) return;

  // Join per Befehl
  if (message.content.toLowerCase() === prefix + instructions[6][0].name.toLowerCase()) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[6][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[6][0].security + "] to use this command.");
      return;
    }
    // Wenn in einem gültigen Channel, join
    message.member.voice.channel ? connectionManager.triggerJoin({"connection" : null}, message.member.voice,serverManager.getRolle(id)) : message.reply('Please enter a channel first!');
  }

  // Leave per Befehl
  else if (message.content.toLowerCase() === prefix + instructions[7][0].name.toLowerCase()) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[7][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[7][0].security + "] to use this command.");
      return;
    }
    connectionManager.triggerLeave(message);
  }

  // setVolume
  else if (message.content.toLowerCase().startsWith(prefix + instructions[18][0].name.toLowerCase() + " ")) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[18][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[18][0].security + "] to use this command.");
      return;
    }
    interactionManager.setVolume(message);
  }

  // getVolume
  else if (message.content.toLowerCase() === prefix + instructions[11][0].name.toLowerCase()) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[11][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[11][0].security + "] to use this command.");
      return;
    }
    message.reply("The volume is " + (100 * interactionManager.getVolume(message)) + "%.");
  }

  //  Help -- ALLE  BEFEHLE GELISTET
  else  if(message.content.toLowerCase().startsWith(prefix + instructions[8][0].name.toLowerCase() + " ") || message.content.toLowerCase() === (prefix + instructions[8][0].name.toLowerCase())){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[8][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[8][0].security + "] to use this command.");
      return;
    }
    interactionManager.help(message, prefix, instructions);
  }

  // Personalisiere Befehle
  else  if(message.content.toLowerCase().startsWith(prefix + instructions[17][0].name.toLowerCase()  + ' ')){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[17][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[17][0].security + "] to use this command.");
      return;
    }
    message.reply(interactionManager.changeCommands(message, prefix, instructions));
  }

  // ModRolle ändern
  else if (message.content.toLowerCase().startsWith(prefix + instructions[10][0].name.toLowerCase()  + ' ')) {
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[10][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[10][0].security + "] to use this command.");
      return;
    }
    roleManager.changeRole(message, JOIN, prefix, instructions);
  }

  // ModRolle anzeigen
  else if (message.content.toLowerCase() === prefix + instructions[9][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[9][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[9][0].security + "] to use this command.");
      return;
    }
    message.reply(roleManager.showRole(serverManager.getRolle(id)));
  }

  // Präfix ändern
  else if(message.content.toLowerCase().startsWith(prefix + instructions[16][0].name.toLowerCase()  + ' ')){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[16][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[16][0].security + "] to use this command.");
      return;
    }
    let newPrefix = interactionManager.changePrefix(message, prefix, instructions);
    if (newPrefix != null) serverManager.setPrefix(id, newPrefix);
  }

  // Lock Room
  else if(message.content.toLowerCase() === prefix + instructions[3][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[3][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[3][0].security + "] to use this command.");
      return;
    }
    lockManager.lock(message,prefix,instructions);
  }

  // Unlock Room
  else if(message.content.toLowerCase() === prefix + instructions[4][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[4][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[4][0].security + "] to use this command.");
      return;
    }
    lockManager.unlock(message);
  }

  //Set Reaction Channel
  else if(message.content.toLowerCase().startsWith(prefix + instructions[20][0].name.toLowerCase() + " ")){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[20][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[20][0].security + "] to use this command.");
      return;
    }
    reactionManager.setupListener(message, client, prefix, instructions);
  }

  //Add Reaction
  else if(message.content.toLowerCase().startsWith(prefix + instructions[23][0].name.toLowerCase() + " ")){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[23][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[23][0].security + "] to use this command.");
      return;
    }
    reactionManager.addReactor(message);
  }

  //change Reaction Role
  else if(message.content.toLowerCase().startsWith(prefix + instructions[19][0].name.toLowerCase() + " ")){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[19][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[19][0].security + "] to use this command.");
      return;
    }
    roleManager.changeRole(message, REACTION, prefix, instructions);
  }

  //show Reaction role
  else if(message.content.toLowerCase() === prefix + instructions[12][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[12][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[12][0].security + "] to use this command.");
      return;
    }
    roleManager.showReactionRole(message);
  }

  //becomeVIP
  else if(message.content.toLowerCase() === prefix + instructions[5][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[5][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[5][0].security + "] to use this command.");
      return;
    }
    vipManager.becomeVIP(message);
  }

  //showWhitelist
  else if(message.content.toLowerCase() === prefix + instructions[14][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[14][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[14][0].security + "] to use this command.");
      return;
    }
    whitelistManager.show(message);
  }

  //whitelistAdd
  else if(message.content.toLowerCase().startsWith(prefix + instructions[21][0].name.toLowerCase() + " ")){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[21][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[21][0].security + "] to use this command.");
      return;
    }
    whitelistManager.addElem(message, prefix, instructions);
  }

  //whitelistRemove
  else if(message.content.toLowerCase().startsWith(prefix + instructions[26][0].name.toLowerCase() + " ")){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[26][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[26][0].security + "] to use this command.");
      return;
    }
    whitelistManager.removeElem(message, prefix, instructions);
  }

  //whitelistClear
  else if(message.content.toLowerCase() === prefix + instructions[28][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[28][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[28][0].security + "] to use this command.");
      return;
    }
    whitelistManager.clear(message);
  }

  //play
  else if(message.content.toLowerCase().startsWith(prefix + instructions[0][0].name.toLowerCase() + " ")){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[0][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[0][0].security + "] to use this command.");
      return;
    }
    connectionManager.play(message, prefix, instructions);
  }

  //setJoinSound
  else if(message.content.toLowerCase().startsWith(prefix + instructions[1][0].name.toLowerCase() + " ")){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[1][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[1][0].security + "] to use this command.");
      return;
    }
    connectionManager.setJoinSound(message, prefix, instructions);
  }

  //removeJoinSound
  else if(message.content.toLowerCase() === prefix + instructions[2][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[2][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[2][0].security + "] to use this command.");
      return;
    }
    connectionManager.removeJoinSound(message);
  }

  //lockable
  else if(message.content.toLowerCase() === prefix + instructions[15][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[15][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[15][0].security + "] to use this command.");
      return;
    }
    lockManager.showLockable(message);
  }

  //lockableAdd
  else if(message.content.toLowerCase() === prefix + instructions[22][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[22][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[22][0].security + "] to use this command.");
      return;
    }
    lockManager.addLockable(message);
  }

  //lockableRemove
  else if(message.content.toLowerCase() === prefix + instructions[27][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[27][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[27][0].security + "] to use this command.");
      return;
    }
    lockManager.removeLockable(message);
  }

  //lockableClear
  else if(message.content.toLowerCase() === prefix + instructions[29][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[29][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[29][0].security + "] to use this command.");
      return;
    }
    lockManager.lockableClear(message);
  }

  //showChannelReact
  else if(message.content.toLowerCase() === prefix + instructions[13][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[13][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[13][0].security + "] to use this command.");
      return;
    }
    reactionManager.showChannelReact(message);
  }

  //removeChannelReact
  else if(message.content.toLowerCase() === prefix + instructions[25][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[25][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[25][0].security + "] to use this command.");
      return;
    }
    reactionManager.removeChannelReact(message);
  }

  //removeReactionRole
  else if(message.content.toLowerCase() === prefix + instructions[24][0].name.toLowerCase()){
    //Hat Zugriffsrechte?
    if(!hasAccessRights(message, instructions[24][0].security)){
      message.reply("You don\'t have permission [LEVEL" + instructions[24][0].security + "] to use this command.");
      return;
    }
    roleManager.removeReactionRole(message);
  }

  // Falsche Eingabe
  else if(message.content.startsWith(prefix)){
    message.reply('Either I don\'t know this command or you\'ve forgotten the parameters :( Type \'' + prefix + instructions[8][0].name + '\' for a list of all the available commands with their parameters!');
  }
});
