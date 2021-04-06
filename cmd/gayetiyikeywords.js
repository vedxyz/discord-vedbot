const cfg = require("../config.json");

module.exports = {
  name: "gayetiyikeywords",
  aliases: ["gikeywords"],
  description: "",
  args: false,
  usage: "",
  guilds: ["dh"],
  permissions: false,
  execute(message, args) {
    
    message.channel.send(
      "Use at least one word from each category to make a very well message <:afro:744923369279062156>:\n\n" + 
      cfg.dh.gayetiyikeywords.map(e => e.join(", ")).join("\n---\n")
    );
    
  }
};
