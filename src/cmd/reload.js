module.exports = {
	name: 'reload',
	description: 'Reloads a file',
  args: true,
  usage: "[command/module name]...",
  guilds: false,
  permissions: ["123867745191198720"],
	execute(message, args) {
		
    args.forEach(arg => {
      
      const file = message.client.commands.get(arg) || message.client.modules.get(arg);
      
      if (!file) return message.reply(`There is no file with name  \`${arg}\`!`);
      
      delete require.cache[require.resolve(`../${file.__rootdir}/${file.name}.js`)];
      
      try {
        
        const newFile = require(`../${file.__rootdir}/${file.name}.js`);
        newFile.__rootdir = file.__rootdir;
        message.client[file.__rootdir === message.client.commands.get("__rootdir") ? "commands" : "modules"].set(newFile.name, newFile);
        
        message.reply(`File \`${file.name}.js\` was reloaded!`);
        
      } catch (error) {
        
        console.error(error);
        message.reply(`There was an error while reloading file \`${file.name}.js\`:\n\`${error.message}\``);
        
      }
      
    });
    
	},
};
