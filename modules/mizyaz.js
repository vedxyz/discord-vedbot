const { MessageEmbed } = require("discord.js");
const cfg = require("../config.json");

const mizyaz = "644968168040955904";

module.exports = {
  name: "mizyaz",
  description: "",
  state: true,
  guilds: ["dh"],
  onMsg(message, optional) {
    
    if (!this.guilds.some(srv => cfg[srv].id === message.guild.id) || !this.state) return;
    
    // Mizyaz module
    let regExp_mizyaz = /[i|İ]slo+[ş|s]\S*/i;
    let mizyazFlag = message.content.match(regExp_mizyaz);
    
    if (mizyazFlag !== null && mizyazFlag.length > 0 && !message.content.endsWith(".") && message.author.id !== mizyaz) {
      
      message.delete();
      
      let mizyazEmbed = new MessageEmbed()
        .setAuthor(message.member.displayName + " says", message.author.avatarURL())
        .setDescription(message.content)
        .setTimestamp()
        .setColor(message.member.displayHexColor);
      
      message.channel.send(`<@${mizyaz}>`, [mizyazEmbed, ...message.attachments.values()]);
      
      //message.channel.send(`<@${message.author.id}> says to <@${mizyaz}>:\n> ${message.content.replace(/^> .*\n/, "")}`); // Old format
      
      return false;
      
    }
    
  }
};
