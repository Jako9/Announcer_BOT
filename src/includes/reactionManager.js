const serverManager = require('./serverManager.js');

module.exports = {
  giveReaction: function(reaction, user){
    let id = reaction.message.guild.id;
    if(user.bot || !serverManager.getChannelReact(id) || serverManager.getChannelReact(id) != reaction.message.channel) return;

    let roleName = reaction.emoji.name.toLowerCase();
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);
    if(!role || !member) return;

    let defaultRole = reaction.message.guild.roles.cache.find(role => role.id == serverManager.getStandartRole(id));
    member.roles.add([role.id,'701520005942083635']);
  },

  removeReaction: function(reaction, user){
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild.id) || serverManager.getChannelReact(reaction.message.guild.id) != reaction.message.channel) return;

    let roleName = reaction.emoji.name.toLowerCase();
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

    if(!role || !member) return;

    member.roles.remove(role.id);
},

  //Das Funktioniert nicht ganz, sollte neu gemacht werden
  addReactor: function(message){
    let id = message.guild.id;
    if(serverManager.getChannelReact(id) == null){
      message.reply('Du musst erst einen Channel auswählen.');
      return;
    }
    let param = message.content.split(' ');
    //Keine Nachricht zum reagieren
    if(!serverManager.getReactionMessage(id)) return;

    //Geforderte Reaktionen hinzufügen
    for(var i = 1; i < param.length; i++){
      serverManager.getReactionMessage(id).react(param[i]);
    }
    message.reply('Reaktion[en] hinzugefügt.');
  },

  setupListener: function(message, client){
    let id = message.guild.id;
    let param = message.content.split(' ');
    let channel = message.guild.channels.cache.find(channel => channel.id == param[1]);
    if(!channel) {
      message.reply('Der Channel konnte nicht gefunden werden');
      return;
    }
    serverManager.setChannelReact(id, channel);
    serverManager.getChannelReact(id).messages.fetch();
    serverManager.setReactionMessage(id, serverManager.getChannelReact(id).messages.cache.find(foo => true));
    message.reply('Setup Erfolgreich.');
  }
}
