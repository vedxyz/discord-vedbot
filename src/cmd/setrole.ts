import cfg from "../config.json";
import { BotCommand } from "../vedbot";

export default {
  name: "setrole",
  aliases: ["roleset"],
  description: "",
  args: true,
  usage: "[DEPARTMENT] [COURSE ID] [SECTION]",
  guilds: ["cs"],
  permissions: [],
  execute(message, args) {
    
    if (!message.guild) return;
    
    const sectionRoles = cfg.servers.cs.roles.sections;
    const userToSet = message.guild.members.cache.get(message.author.id);
    
    if (!userToSet) return;
    
    if (args.length === 3) {
      
      if (Object.prototype.hasOwnProperty.call(sectionRoles, args[0].toUpperCase() + args[1] + args[2])) {
        
        Object.entries(sectionRoles)
              .filter(e => e[0].startsWith(args[0].toUpperCase() + args[1]))
              .map(e => e[1])
              .forEach(e => userToSet.roles.remove(e));
        
        setTimeout(() => userToSet.roles.add(sectionRoles[args[0].toUpperCase() + args[1] + args[2] as keyof typeof sectionRoles]), 1500);
        
        message.react("👍");
        
      } else {
        
        message.reply("ERROR: Unrecognized arguments. Are you sure this course/section exists?");
        
      }
      
    } else {
      
      message.reply(`ERROR: Incorrect number of arguments. Use \`${cfg.prefix}help\` to see syntax.`);
      
    }
    
    setTimeout(() => message.delete(), 30000);
    
  }
} as BotCommand;
