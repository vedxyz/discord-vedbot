/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { BotCommand, vedbot } from "../vedbot";

export default {
	name: 'reload',
  aliases: [],
	description: 'Reloads a file',
  args: true,
  usage: "[command/module name]...",
  guilds: [],
  permissions: [],
  allowedUser: ["123867745191198720"],
	execute(message, args) {
		
    args.forEach(arg => {
      
      const file = vedbot.commands.collection.get(arg) || vedbot.modules.collection.get(arg);
      
      if (!file) return message.reply(`There is no file with name  \`${arg}\`!`);
      
      delete require.cache[require.resolve(`../${file.rootdir}/${file.name}.js`)];
      
      try {
        
        const newFile = require(`../${file.rootdir}/${file.name}.js`);
        newFile.rootdir = file.rootdir;
        vedbot[file.rootdir === vedbot.commands.rootdir ? "commands" : "modules"].collection.set(newFile.name, newFile);
        
        message.reply(`File \`${file.name}.js\` was reloaded!`);
        
      } catch (error) {
        
        // eslint-disable-next-line no-console
        console.error(error);
        message.reply(`There was an error while reloading file \`${file.name}.js\`:\n\`${error.message}\``);
        
      }
      
      return "";
    });
    
	},
} as BotCommand;
