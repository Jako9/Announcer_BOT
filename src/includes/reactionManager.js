const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

function delRole(reaction,role,member){
  if(!role || !member){
    logManager.writeDebugLog(reaction.message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht entfernt werden (Die Rolle oder der Nutzer existieren nicht).");
    return;
  }

  logManager.writeDebugLog(reaction.message.guild.name + ": Die Rolle der Reaktion wurde erfolgreich entfernt.");
  member.roles.remove(role.id);
}

async function removeForeignReactions(message, reaction){
  if(!message) return false;
  let removed = false;
  message.reactions.cache.array().forEach(async tmpReaction =>{
    await tmpReaction.users.fetch();
    let user = tmpReaction.users.cache.array().find(user => {
      return user.bot;
    });
    if(user == undefined) {
      tmpReaction.remove();
      if(reaction.emoji.id == tmpReaction.emoji.id){
        removed = true
      }
    }
  });
  logManager.writeDebugLog("Removed = " + removed);
  return removed;
}

module.exports = {
  giveReaction: async function(reaction, user){

    let id = reaction.message.guild.id;

    let removed = await removeForeignReactions(serverManager.getReactionMessage(id), reaction);
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild) || serverManager.getChannelReact(reaction.message.guild) != reaction.message.channel || serverManager.getReactionMessage(id) == null || reaction.message.id != serverManager.getReactionMessage(id).id || removed) return;

    let roleName = reaction.emoji.name.toLowerCase();
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);
    if(!role || !member) {
      logManager.writeDebugLog(reaction.message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Die Rolle oder der Nutzer existieren nicht).");
      return;
    }

    let defaultRole = reaction.message.guild.roles.cache.find(role => role.id == serverManager.getStandartRole(id).id);
    if(defaultRole){
      logManager.writeDebugLog(reaction.message.guild.name + ": Die Rolle der Reaktion wurde erfolgreich vergeben.");
      member.roles.add([role.id,defaultRole.id]);
    }
    else{
      logManager.writeDebugLog(reaction.message.guild.name + ": Die Rolle der Reaktion wurde erfolgreich vergeben.");
      member.roles.add(role.id);
    }
  },

  removeReaction: function(reaction, user){
    //Uninteressant
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild) || serverManager.getChannelReact(reaction.message.guild) != reaction.message.channel || reaction.message.id != serverManager.getReactionMessage(reaction.message.guild.id).id) return;

    let roleName = reaction.emoji.name.toLowerCase();
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
    reaction.message.guild.members.fetch(user).then(member => delRole(reaction, role,member)).catch();
},

  addReactor: function(message){
    let id = message.guild.id;
    if(serverManager.getChannelReact(message.guild) == null){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Reaktion konnte nicht hinzugefügt werden (Es gibt keinen gültigen Channel).");
      message.reply('You must select a channel first.');
      return;
    }
    let param = message.content.split(' ');
    //Keine Nachricht zum reagieren
    if(!serverManager.getReactionMessage(id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Es gibt keine gültige Nachricht).");
      message.reply('There is no pinned message in this channel. If you need help with the setup, refer to our website @setup');
      return;
    }

    let reaction = '';
    if(param.length != 2){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine korrekte Syntax).");
      message.reply('The reaction could not be added. (incorrect Syntax). If you need help with the setup, refer to our website @setup');
      return;
    }
    //Ein custom Emoji
    if(param[1].startsWith('<') && param[1].endsWith('>') && param[1].split(':').length == 3){
      reaction = param[1].split(':')[2].substring(0,param[1].split(':')[2].length -1);
    }
    //Ein StandartEmoji
    else if(/(?=\p{Emoji})(?!\p{Number})/u.test(param[1])){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine custom Reaction).");
      message.reply('The reaction could not be added. . If you need help with the setup, refer to our website @setup');
      return;
    }
    else{
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Kein Emoji gefunden).");
      message.reply('The reaction could not be added. (No emoji found). If you need help with the setup, refer to our website @setup');
      return;
    }
    try{
      //Geforderte Reaktion hinzufügen
      serverManager.getReactionMessage(id).react(reaction);
      logManager.writeDebugLog(message.guild.name + ": Die Reaktion wurden erfolgreich hinzugefügt.");
      message.reply('The reaction has been added successfully.');
    }
    catch(e){
      //Reaktion ungültig
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine korrekte Syntax).");
      message.reply('The reaction could not be added. If you need help with the setup, refer to our website @setup');
      return;
    }
  },

  setupListener: function(message, client, prefix, instructions){
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht aufgesetzt werden(Fehlerhafte Argumente).");
      message.reply('Incorrect usage of \'' + prefix +  instructions[20][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax. If you need help with the setup, refer to our website @setup');
      return;
    }
    let channel = message.mentions.channels.find(channel => true);
    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht aufgesetzt werden(Der Channel konnte nicht hinzugefügt werden).");
      message.reply('The channel could not be found. If you need help with the setup, refer to our website @setup');
      return;
    }
    serverManager.setChannelReact(id, channel);
    serverManager.getChannelReact(message.guild).messages.fetch();
    serverManager.setReactionMessage(id, serverManager.getChannelReact(message.guild).messages.cache.find(message => message.pinned));
    logManager.writeDebugLog(message.guild.name + ": Der Channel wurde erfolgreich aufgesetzt.");
    message.reply('Setup successful.');
  },

  showChannelReact: function(message){
    if(serverManager.getChannelReact(message.guild) == null){
      message.reply("There is no reaction channel active.");
      return;
    }
    message.reply(serverManager.getChannelReact(message.guild).name);
  },

  removeChannelReact: function(message){
    serverManager.setChannelReact(message.guild.id, null);
    message.reply("The reaction channel has been removed.");
  }
}
