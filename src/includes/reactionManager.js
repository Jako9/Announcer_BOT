const serverManager = require('./serverManager.js');

module.exports = {
  giveReaction: function(reaction, user){
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild.id) || serverManager.getChannelReact(reaction.message.guild.id) != reaction.message.channel) return;

    let roleName = reaction.emoji.name;
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

    if(!role || !member) return;

    let strl = reaction.message.guild.roles.cache.find(role => role.id == serverManager.getStandartRole(reaction.message.guild.id));

    if(strl) member.roles.add(strl);

    member.roles.add(role.id);
  },

  removeReaction: function(reaction, user){
    if(user.bot || !serverManager.getChannelReact(reaction.message.guild.id) || serverManager.getChannelReact(reaction.message.guild.id) != reaction.message.channel) return;

    let roleName = reaction.emoji.name;
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

    if(!role || !member) return;

    member.roles.remove(role.id);
},

  //Das Funktioniert nicht ganz, sollte neu gemacht werden
  addReactor: function(message){
      if(serverManager.getChannelReact(message.guild.id) == null){
          message.reply('Du musst erst einen Channel auswählen.');
          return;
        }
        let msg = message.content.split(' ');
        if(!serverManager.getReactionMessage(message.guild.id)) return;
    
        //Geforderte Reaktionen hinzufügen
        for(var i = 1; i < msg.length; i++){
          serverManager.getReactionMessage(message.guild.id).react(msg[i]);
        }
        message.reply('Reaktion[en] hinzugefügt.');
  },

  setupListener: function(message, client){
      let msg = message.content.split(' ');
      let channel = client.channels.cache.find(channel => channel.id == msg[1]);
      if(!channel) {
        message.reply('Der Channel konnte nicht gefunden werden');
        return;
      }
      else{
        serverManager.setChannelReact(message.guild.id, channel);
        serverManager.getChannelReact(message.guild.id).messages.fetch();
        serverManager.setReactionMessage(message.guild.id, serverManager.getChannelReact(message.guild.id).messages.cache.find(foo => true));
        message.reply('Setup Erfolgreich.');
      }
    }
}

