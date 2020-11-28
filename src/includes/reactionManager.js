const standartServer = '704731466558603376';
const standartChannel = '704735030521495633';
const standartRole = '704755265735753748';
var channelReact;
var reactionMessage;

module.exports = {
  giveReaction: function(reaction, user){
    if(user.bot || !channelReact || channelReact != reaction.message.channel) return;

    let roleName = reaction.emoji.name;
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

    if(!role || !member) return;

    let strl = reaction.message.guild.roles.cache.find(role => role.id == standartRole);

    if(strl) member.roles.add(strl);

    member.roles.add(role.id);
  },

  removeReaction: function(reaction, user){
    if(user.bot || !channelReact || channelReact != reaction.message.channel) return;

    let roleName = reaction.emoji.name;
    let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

    if(!role || !member) return;

    member.roles.remove(role.id);
},

  setupReaction: function(client){
      //Setup für Rollen per React
    let guild = client.guilds.cache.get(standartServer);
    channelReact = guild.channels.cache.find(channel => channel.id == standartChannel);
    channelReact.messages.fetch();
    reactionMessage = channelReact.messages.cache.find(foo => true);
  },

  //Das Funktioniert nicht ganz, sollte neu gemacht werden
  addReactor: function(message){
      if(channelReact == null){
          message.reply('Du musst erst einen Channel auswählen.');
          return;
        }
        let msg = message.content.split(' ');
        if(!reactionMessage) return;
    
        //Geforderte Reaktionen hinzufügen
        for(var i = 1; i < msg.length; i++){
          reactionMessage.react(msg[i]);
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
        channelReact = channel;
        channelReact.messages.fetch();
        reactionMessage = channelReact.messages.cache.find(foo => true);
        message.reply('Setup Erfolgreich.');
      }
    }
}

