const cfg = require("../config.json");

module.exports = {
  name: "vedconcept",
  description: "",
  state: true,
  guilds: ["cr"],
  onMsg(message, optional) {
    
    if (message.channel.type === "dm" || !this.guilds.some(srv => cfg[srv].id === message.guild.id) || !this.state) return;
    
    if (cfg.cr.concepts.some(concept => message.mentions.users.has(concept))) {
      
      message.reply({ files: ["https://cdn.discordapp.com/attachments/795054934470557728/839531844818042890/image0.png"] });
      
      return false;
      
    }
    
  }
};
