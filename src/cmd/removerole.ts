import cfg from "../config.json";
import { BotCommand } from "../vedbot";

export default {
  name: "removerole",
  aliases: ["roleremove"],
  description: "",
  args: true,
  usage: "[DEPARTMENT] [COURSE ID] [SECTION]",
  guilds: ["cs"],
  permissions: [],
  execute(message, args) {
    
    const sectionRoles = cfg.servers.cs.roles.sections;
    const userToSet = message.guild?.members.cache.get(message.author.id);
    
    if (!userToSet) return;
    
    if (args.length === 3) {
      
      if (Object.prototype.hasOwnProperty.call(sectionRoles, args[0].toUpperCase() + args[1] + args[2])) {
        
        if (userToSet.roles.cache.has(sectionRoles[args[0].toUpperCase() + args[1] + args[2] as keyof typeof sectionRoles])) {
          
          userToSet.roles.remove(sectionRoles[args[0].toUpperCase() + args[1] + args[2] as keyof typeof sectionRoles]);
          
          message.react("👍");
          
        } else {
          
          message.reply("ERROR: You currently do not have this role.");
          
        }
        
      } else {
        
        message.reply("ERROR: Unrecognized arguments. Are you sure this course/section exists?");
        
      }
      
    } else {
      
      message.reply(`ERROR: Incorrect number of arguments. Use \`${cfg.prefix}help\` to see syntax.`);
      
    }
    
    setTimeout(() => message.delete(), 30000);
    
  }
} as BotCommand;
