const cfg = require("../config.json");

module.exports = {
  name: "guildjoinleave",
  description: "",
  state: true,
  guilds: ["cs", "dh"],
  onJoin(member, optional) {
    
    if (!this.guilds.some(srv => cfg[srv].id === member.guild.id) || !this.state) return;
    
    optional.serverVars[ this.guilds.find(srv => cfg[srv].id === member.guild.id) ]
            .channels.log
            .send(`:o: -> Joined the server: **${member.displayName}**#${member.user.discriminator}`);
    
    if (member.guild.id === cfg.dh.id) {
      
      optional.serverVars.dh.channels.newbie.send(
        `Merhaba <@${member.id}> :),\n` + 
        `Sunucunun tamamına erişmek için;\n` + 
        `1- <#${cfg.dh.channels.rules}>'ı onaylamanız\n` + 
        `2- <#${cfg.dh.channels.rolepick}> kanalından bölüm ve sınıf seçmeniz\n` + 
        `gerekmekte.`
      );
      
    }
    
  },
  onLeave(member, optional) {
    
    if (!this.guilds.some(srv => cfg[srv].id === member.guild.id) || !this.state) return;
    
    optional.serverVars[ this.guilds.find(srv => cfg[srv].id === member.guild.id) ]
            .channels.log
            .send(`:x: -> Left the server: **${member.displayName}**#${member.user.discriminator}`);
    
  }
};
