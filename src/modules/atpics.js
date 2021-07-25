const cfg = require("../config.json");

module.exports = {
  name: "atpics",
  description: "",
  state: true,
  guilds: ["cr"],
  onMsg(message, optional) {
    
    if (message.channel.type === "dm" || !this.guilds.some(srv => cfg[srv].id === message.guild.id) || !this.state) return;
    
    const at_pics = [];
    
    message.mentions.users.each(user => {
      if (cfg.cr.at_pics.hasOwnProperty(user.id) && at_pics.length < 10) {
        at_pics.push(cfg.cr.at_pics[user.id]);
      }
    });
    
    if (at_pics.length !== 0) {
      
      message.reply({ files: at_pics });
      
      return false;
      
    }
    
  }
};
