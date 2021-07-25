const cfg = require("../config.json");

module.exports = {
  name: "gayetiyi",
  description: "",
  state: true,
  guilds: ["dh"],
  onMsg(message, optional) {
    
    if (!this.guilds.some(srv => cfg[srv].id === message.guild.id) || !this.state) return;
    
    // Gayet iyi module
    let msg = message.content.toLowerCase().split(/\s/);
    
    if (cfg.dh.gayetiyikeywords.every(wordlist => wordlist.some(word => msg.indexOf(word) !== -1))) {
      
      let localResponse = message.channel.id !== cfg.dh.channels.english ? "gayet iyi" : "very well";
      return (`**${localResponse}** <:afro:744923369279062156>`);
      
    }
    
  }
};
