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

module.exports = {
  giveReaction: function(reaction, user){

    let id = reaction.message.guild.id;
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild) || serverManager.getChannelReact(reaction.message.guild) != reaction.message.channel || reaction.message.id != serverManager.getReactionMessage(id).id) return;

    let roleName = reaction.emoji.name.toLowerCase();
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);
    if(!role || !member) {
      logManager.writeDebugLog(reaction.message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Die Rolle oder der Nutzer existieren nicht).");
      return;
    }

    let defaultRole = reaction.message.guild.roles.cache.find(role => role.name == serverManager.getStandartRole(id));
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
      message.reply('Du musst erst einen Channel auswählen.');
      return;
    }
    let param = message.content.split(' ');
    //Keine Nachricht zum reagieren
    if(!serverManager.getReactionMessage(id)){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Es gibt keine gültige Nachricht).");
      return;
    }

    let reaction = '';
    if(param.length != 2){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine korrekte Syntax).");
      message.reply('Reaktionen konnten nicht hinzugefügt werden.');
      return;
    }
    //Ein custom Emoji
    if(param[1].startsWith('<') && param[1].endsWith('>') && param[1].split(':').length == 3){
      reaction = param[1].split(':')[2].substring(0,param[1].split(':')[2].length -1);
    }
    //Ein StandartEmoji
    else if(/(?=\p{Emoji})(?!\p{Number})/u.test(param[1])){
      reaction = param[1];
    }
    else{
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine korrekte Syntax).");
      message.reply('Reaktionen konnten nicht hinzugefügt werden.');
      return;
    }
    try{
      //Geforderte Reaktion hinzufügen
      serverManager.getReactionMessage(id).react(reaction);
      logManager.writeDebugLog(message.guild.name + ": Die Reaktion wurden erfolgreich hinzugefügt.");
      message.reply('Reaktion hinzugefügt.');
    }
    catch(e){
      //Reaktion ungültig
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Die Rolle der Reaktion konnte nicht vergeben werden (Keine korrekte Syntax).");
      message.reply('Reaktionen konnten nicht hinzugefügt werden.');
      return;
    }
  },

  setupListener: function(message, client, prefix, instructions){
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht aufgesetzt werden(Fehlerhafte Argumente).");
      message.reply('Ungültige Eingabe für \'' + prefix +  instructions[11][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.');
      return;
    }
    let channel = message.mentions.channels.find(channel => true);
    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": <span style='color:#c72222;'>FEHLER</span>: Der Channel konnte nicht aufgesetzt werden(Der Channel konnte nicht hinzugefügt werden).");
      message.reply('Der Channel konnte nicht gefunden werden');
      return;
    }
    serverManager.setChannelReact(id, channel);
    serverManager.getChannelReact(message.guild).messages.fetch();
    serverManager.setReactionMessage(id, serverManager.getChannelReact(message.guild).messages.cache.find(message => message.pinned));
    logManager.writeDebugLog(message.guild.name + ": Der Channel wurde erfolgreich aufgesetzt.");
    message.reply('Setup Erfolgreich.');
  },

  showChannelReact: function(message){
    if(serverManager.getChannelReact(message.guild) == null){
      message.reply("Aktuell gibt es keinen Channel, in dem auf Reaktionen gehorcht wird.");
      return;
    }
    message.reply(serverManager.getChannelReact(message.guild).name);
  },

  removeChannelReact: function(message){
    serverManager.setChannelReact(message.guild.id, null);
    message.reply("Es gibt nun keinen Channel mehr, in dem auf Reaktionen gehorcht wird.");
  }
}
