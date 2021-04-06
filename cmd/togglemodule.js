const { MessageEmbed } = require("discord.js");
const cfg = require("../config.json");

const ved = "123867745191198720";

module.exports = {
  name: "togglemodule",
  aliases: ["tmod"],
  description: "",
  args: false,
  usage: "[module name]...",
  guilds: ["dh", "cr", "cs"],
  permissions: ["ADMINISTRATOR", ved],
  execute(message, args) {
    
    let availableModules = message.client.modules.filter(module => 
      module.guilds && module.guilds.some(srv => cfg[srv].id === message.guild.id)
    );
    
    if (!args.length) {
      
      return message.reply(
        new MessageEmbed()
          .setTitle("VedBot Flexible Modules")
          .setDescription("Lists modules available for this server. Commands not included.")
          .setTimestamp()
          .setFooter(`${message.client.modules.size - 1} modules loaded in total.`)
          .setColor("RED")
          .setThumbnail(message.client.user.avatarURL())
          .addFields(availableModules.map(module => ({ name: `${module.name} | ${module.state ? "ENABLED" : "DISABLED"}`, value: module.description || "No description added.", inline: false })))
      );
      
      /*
      return message.reply("Modules for this server:" +
        availableModules.map(module => 
          "\n-> " + module.name + `: **${module.state ? "ENABLED" : "DISABLED"}**`
        ).join("")
      );
      */
      
    }
    
    args.forEach(arg => {
      
      let module = availableModules.find(module => module.name === arg);
      
      if (module) {
        
        module.state = !module.state;
        message.channel.send(`"${arg}" module is now **${module.state ? "ENABLED" : "DISABLED"}**.`);
        
      } else {
        
        message.channel.send(`"${arg}" module is not available.`);
        
      }
      
    });
    
  }
};
