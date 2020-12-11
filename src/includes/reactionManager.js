const serverManager = require('./serverManager.js');
const logManager = require('./logManager.js');

module.exports = {
  giveReaction: function(reaction, user){
    let id = reaction.message.guild.id;
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild) || serverManager.getChannelReact(reaction.message.guild) != reaction.message.channel) return;

    let roleName = reaction.emoji.name.toLowerCase();
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);
    if(!role || !member) {
      logManager.writeDebugLog(reaction.message.guild.name + ": FEHLER: Die Rolle der Reaktion konnte nicht vergeben werden (Die Rolle oder der Nutzer existieren nicht).");
      return;
    }

    let defaultRole = reaction.message.guild.roles.cache.find(role => role.name == serverManager.getStandartRole(id));
    if(defaultRole){
      logManager.writeDebugLog(reaction.message.guild.name + "Die Rolle der Reaktion wurde erfolgreich vergeben.");
      member.roles.add([role.id,defaultRole.id]);
    }
    else{
      logManager.writeDebugLog(reaction.message.guild.name + "Die Rolle der Reaktion wurde erfolgreich vergeben.");
      member.roles.add(role.id);
    }
  },

  removeReaction: function(reaction, user){
    //Uninteressant
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild) || serverManager.getChannelReact(reaction.message.guild) != reaction.message.channel) return;

    let roleName = reaction.emoji.name.toLowerCase();
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

    if(!role || !member){
      logManager.writeDebugLog(reaction.message.guild.name + ": FEHLER: Die Rolle der Reaktion konnte nicht entfernt werden (Die Rolle oder der Nutzer existieren nicht).");
      return;
    }

    logManager.writeDebugLog(reaction.message.guild.name + ": Die Rolle der Reaktion wurde erfolgreich entfernt.");
    member.roles.remove(role.id);
},

  //Das Funktioniert nicht ganz, sollte neu gemacht werden
  addReactor: function(message){
    let id = message.guild.id;
    if(serverManager.getChannelReact(message.guild) == null){
      logManager.writeDebugLog(message.guild.name + ": FEHLER: Die Reaktion konnte nicht hinzugefügt werden (Es gibt keinen gültigen Channel).");
      message.reply('Du musst erst einen Channel auswählen.');
      return;
    }
    let param = message.content.split(' ');
    //Keine Nachricht zum reagieren
    if(!serverManager.getReactionMessage(id)){
      logManager.writeDebugLog(message.guild.name + ": FEHLER: Die Rolle der Reaktion konnte nicht vergeben werden (Es gibt keine gültige Nachricht).");
      return;
    }

    //Geforderte Reaktionen hinzufügen
    for(var i = 1; i < param.length; i++){
      serverManager.getReactionMessage(id).react(param[i]);
    }
    logManager.writeDebugLog(message.guild.name + ": Die Reaktion[en] wurden erfolgreich hinzugefügt.");
    message.reply('Reaktion[en] hinzugefügt.');
  },

  setupListener: function(message, client, prefix, instructions){
    let id = message.guild.id;
    if(message.content.split(' ').length < 2 || message.mentions.channels.size != 1){
      logManager.writeDebugLog(message.guild.name + ": FEHLER: Der Channel konnte nicht aufgesetzt werden(Fehlerhafte Argumente).");
      message.reply('Ungültige Eingabe für \'' + prefix +  instructions[11][0] + '\', schreibe \'' + prefix +  instructions[4][0] + '\' für korrekte Syntax.');
      return;
    }
    let channel = message.mentions.channels.find(channel => true);
    if(!channel) {
      logManager.writeDebugLog(message.guild.name + ": FEHLER: Der Channel konnte nicht aufgesetzt werden(Der Channel konnte nicht hinzugefügt werden).");
      message.reply('Der Channel konnte nicht gefunden werden');
      return;
    }
    serverManager.setChannelReact(id, channel);
    serverManager.getChannelReact(message.guild).messages.fetch();
    serverManager.setReactionMessage(id, serverManager.getChannelReact(message.guild).messages.cache.find(foo => true));
    logManager.writeDebugLog(message.guild.name + ": Der Channel wurde erfolgreich aufgesetzt.");
    message.reply('Setup Erfolgreich.');
  }
}