const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

function delRole(reaction,role,member){
  if(!role || !member){
    logManager.writeDebugLog(reaction.message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht entfernt werden (Die Rolle oder der Nutzer existieren nicht).");
    return;
  }

  logManager.writeDebugLog(reaction.message.guild.name + ": Die Rolle der Reaktion wurde erfolgreich entfernt.");
  member.roles.remove(role.id).catch(err => {logManager.writeErrorLog(err.stack);});
}

async function removeForeignReactions(message, reaction){
  if(!message) return false;
  if(!message.reactions) return false;
  let removed = false;
  let reactions = message.reactions.cache;
  for(let i = 0; i < reactions.size; i++){
    await reactions.at(i).users.fetch();
    let user = reactions.at(i).users.cache.find((key, user) => {
      return user.bot;
    });
    if(user == undefined) {
      reactions.at(i).remove().catch(err => {logManager.writeErrorLog(err.stack);});
      if(reaction && reaction.emoji.id == reactions.at(i).emoji.id){
        removed = true
      }
    }
  }
  return removed;
}

module.exports = {
  giveReaction: async function(reaction, user){

    let id = reaction.message.guild.id;
    try{
      let removed = await removeForeignReactions(serverManager.getReactionMessage(id), reaction);
      if(user.bot || !serverManager.getChannelReact(reaction.message.guild) || serverManager.getChannelReact(reaction.message.guild) != reaction.message.channel || serverManager.getReactionMessage(id) == undefined || reaction.message.id != serverManager.getReactionMessage(id).id || removed) return;

      let roleName = reaction.emoji.name.toLowerCase();
      let role = reaction.message.guild.roles.cache.find((key, role) => role.name.toLowerCase() === roleName);
      let member = reaction.message.guild.members.cache.find((key, member) => member.id === user.id);
      if(!role || !member) {
        logManager.writeDebugLog(reaction.message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Die Rolle oder der Nutzer existieren nicht).");
        return;
      }

      let defaultRole = reaction.message.guild.roles.cache.find((key, role) => role.id == serverManager.getStandartRole(id).id);
      if(defaultRole){
        logManager.writeDebugLog(reaction.message.guild.name + ": Die Rolle der Reaktion wurde erfolgreich vergeben.");
        member.roles.add([role.id,defaultRole.id]).catch(err => {logManager.writeErrorLog(err.stack);});
      }
      else{
        logManager.writeDebugLog(reaction.message.guild.name + ": Die Rolle der Reaktion wurde erfolgreich vergeben.");
        member.roles.add(role.id).catch(err => {logManager.writeErrorLog(err.stack);});
      }
    }
    catch(e){
    }
  },

  removeReaction: function(reaction, user){
    //Uninteressant
    try{
      removeForeignReactions(serverManager.getReactionMessage(reaction.message.guild.id), reaction);
      if(user.bot || !serverManager.getChannelReact(reaction.message.guild) || serverManager.getChannelReact(reaction.message.guild) != reaction.message.channel || serverManager.getReactionMessage(reaction.message.guild.id) == undefined || reaction.message.id != serverManager.getReactionMessage(reaction.message.guild.id).id) return;

      let roleName = reaction.emoji.name.toLowerCase();
      let role = reaction.message.guild.roles.cache.find((key, role) => role.name.toLowerCase() === roleName);
      reaction.message.guild.members.fetch(user).then(member => delRole(reaction, role,member)).catch(err => {logManager.writeErrorLog(err.stack);});
    }
    catch(e){
    }
},

  addReactor: function(message){
    removeForeignReactions(serverManager.getReactionMessage(message.guild.id), null);
    let id = message.guild.id;
    if(serverManager.getChannelReact(message.guild) == null){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Reaktion konnte nicht hinzugefügt werden (Es gibt keinen gültigen Channel).");
      message.reply({content: 'You must select a channel first.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    let param = message.content.split(' ');
    //Keine Nachricht zum reagieren
    if(!serverManager.getReactionMessage(id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Es gibt keine gültige Nachricht).");
      message.reply({content: 'There is no pinned message in this channel. If you need help with the setup, refer to our website @setup', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }

    let reaction = '';
    if(param.length != 2){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine korrekte Syntax).");
      message.reply({content: 'The reaction could not be added. (incorrect Syntax). If you need help with the setup, refer to our website @setup', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    //Ein custom Emoji
    if(param[1].startsWith('<') && param[1].endsWith('>') && param[1].split(':').length == 3){
      reaction = param[1].split(':')[2].substring(0,param[1].split(':')[2].length -1);
    }
    //Ein StandartEmoji
    else if(/(?=\p{Emoji})(?!\p{Number})/u.test(param[1])){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine custom Reaction).");
      message.reply({content: 'The reaction could not be added. . If you need help with the setup, refer to our website @setup', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    else{
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Kein Emoji gefunden).");
      message.reply({content: 'The reaction could not be added. (No emoji found). If you need help with the setup, refer to our website @setup', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    try{
      //Geforderte Reaktion hinzufügen
      serverManager.getReactionMessage(id).react(reaction).catch(err => {logManager.writeErrorLog(err.stack);});
      logManager.writeDebugLog(message.guild.name + ": Die Reaktion wurden erfolgreich hinzugefügt.");
      message.reply({content: 'The reaction has been added successfully.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
    }
    catch(e){
      //Reaktion ungültig
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine korrekte Syntax).");
      message.reply({content: 'The reaction could not be added. If you need help with the setup, refer to our website @setup', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
  },

  setupListener: function(message, client, prefix, instructions){
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht aufgesetzt werden(Fehlerhafte Argumente).");
      message.reply({content: 'Incorrect usage of \'' + prefix +  instructions[20][0].name + '\', type \'' + prefix +  instructions[8][0].name + '\' for the correct syntax. If you need help with the setup, refer to our website @setup', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    let channel = message.mentions.channels.find(channel => true);
    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht aufgesetzt werden(Der Channel konnte nicht hinzugefügt werden).");
      message.reply({content: 'The channel could not be found. If you need help with the setup, refer to our website @setup', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    channel.messages.fetch();
    if(channel.messages.cache.find((key, message) => message.pinned) == null){
      message.reply({content: "I didn\'t find any pinned messages in this channel. Be sure to first pin the message you want to be reacted on.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    serverManager.setChannelReact(id, channel);
    serverManager.setReactionMessage(id, serverManager.getChannelReact(message.guild).messages.cache.find(message => message.pinned));
    logManager.writeDebugLog(message.guild.name + ": Der Channel wurde erfolgreich aufgesetzt.");
    message.reply({content: 'Setup successful.', allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
  },

  showChannelReact: function(message){
    if(serverManager.getChannelReact(message.guild) == null){
      message.reply({content: "There is no reaction channel active.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    message.reply({content: serverManager.getChannelReact(message.guild).name, allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
  },

  removeChannelReact: function(message){
    if(serverManager.getChannelReact(message.guild) == null){
      message.reply({content: "There is no reaction channel setup that can be removed.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
      return;
    }
    serverManager.setChannelReact(message.guild.id, null);
    message.reply({content: "The reaction channel has been removed.", allowedMentions: {repliedUser: true}}).catch(err => {logManager.writeErrorLog(err.stack);});
  }
}
