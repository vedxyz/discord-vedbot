import cfg from "../config.json";
import { BotModule } from "../vedbot";

export default {
  name: "guildjoinleave",
  description: "",
  state: true,
  guilds: ["cs", "dh"],
  onMemberJoin(member, optional) {
    if (!this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id) || !this.state)
      return;

    const serverKey = this.guilds.find((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id);
    if (!serverKey) return;

    optional.serverVars[serverKey].channels.log.send(
      `:o: -> Joined the server: **${member.displayName}**#${member.user.discriminator}`
    );

    if (member.guild.id === cfg.servers.dh.id) {
      optional.serverVars.dh.channels.newbie.send(
        `Merhaba <@${member.id}> :),\n` +
          `Sunucunun tamamına erişmek için;\n` +
          `1- <#${cfg.servers.dh.channels.rules}>'ı onaylamanız\n` +
          `2- <#${cfg.servers.dh.channels.rolepick}> kanalından bölüm ve sınıf seçmeniz\n` +
          `gerekmekte.`
      );
    }
  },
  onMemberLeave(member, optional) {
    if (!this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id) || !this.state) return;
    
    const serverKey = this.guilds.find((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id);
    if (!serverKey) return;
    
    optional.serverVars[serverKey].channels.log.send(
      `:x: -> Left the server: **${member.displayName}**#${member.user.discriminator}`
    );
  },
} as BotModule;
