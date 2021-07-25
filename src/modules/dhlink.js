const { MessageEmbed } = require("discord.js");
const cfg = require("../config.json");

module.exports = {
  name: "dhlink",
  description: "Convert mobile/desktop DonanimHaber links to their counterparts.",
  state: true,
  guilds: ["dh", "cs"],
  onMsg(message, optional) {
    
    if (!this.guilds.some(srv => cfg[srv].id === message.guild.id) || !this.state) return;
    
    let msg = message.content.toLowerCase().split(/\s/);
    
    // Mobile-desktop forum link helper
    let DH_links = [];
    let regExp_linkDH = /^https?:\/\/(mobile|forum)\.donanimhaber.com\//i;
    
    msg.filter(e => e.startsWith("http")).forEach(function (e) { 
      
      let DH_convertedUrl = e.replace(regExp_linkDH, (match, p1) => "https://" + (p1.toLowerCase() === "mobile" ? "forum" : "mobile") + ".donanimhaber.com/");
      
      if (DH_convertedUrl !== e) DH_links.push(DH_convertedUrl);
      
    });
    
    if (DH_links.length) {
      
      
      let linksEmbed = new MessageEmbed()
        .setTitle("Alternate DH Links")
        .setColor("#F1672D")
        .setThumbnail("https://forum.donanimhaber.com/static/forum/img/dh-forum-logo.png")
        .setTimestamp()
        .setAuthor(message.member.displayName, message.author.avatarURL())
        .addFields(DH_links.map((link, i) => ({ name: `Link #${i+1}`, value: link, inline: false })));
      
      //let DH_linksString = DH_links.map((e, i) => `Link #${i + 1}: <${e}>`).join("\n");
      //return ("Alternate desktop/mobile link(s):\n" + DH_linksString);
      message.reply(linksEmbed);
      return false;
      
    }
    
  }
};
