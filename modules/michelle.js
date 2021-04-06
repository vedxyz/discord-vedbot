const cfg = require("../config.json");

module.exports = {
  name: "michelle",
  description: "Makes sure to let Michelle know it has been an honor.",
  state: true,
  guilds: ["cr"],
  execute(oldState, newState, channel) {
    
    if (!this.guilds.some(srv => cfg[srv].id === oldState.guild.id) || !this.state) return;
    
    if (oldState.member.id === cfg.cr.musicbot_id && newState.channelID === null) {
      
      let image = Math.random() > 0.5 ? 
        "https://cdn.discordapp.com/attachments/795054934470557728/814976435021283429/5kuavjmbnhz11.png" : 
        "https://cdn.discordapp.com/attachments/396863166325456896/828790065999904778/iu.png";
      
      channel.send({ files: [image] });
      
    }
    
  }
};
