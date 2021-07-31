import { BotModule, cfg, vedbot } from "../vedbot";

export default {
  name: "guildjoinleave",
  description: "",
  state: true,
  guilds: ["cs", "dh"],
  onMemberJoin(member) {
    if (!this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id) || !this.state)
      return;

    const serverKey = this.guilds.find(
      (srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id
    ) as keyof typeof vedbot.guilds;
    if (!serverKey) return;

    vedbot.guilds[serverKey].channels
      .get("log")
      ?.send(`:o: -> Joined the server: **${member.displayName}**#${member.user.discriminator}`);

    if (member.guild.id === cfg.servers.dh.id) {
      vedbot.guilds.dh.channels
        .get("newbie")
        ?.send(
          `Merhaba <@${member.id}> :),\n` +
            `Sunucunun tamamına erişmek için;\n` +
            `1- <#${cfg.servers.dh.channels.rules}>'ı onaylamanız\n` +
            `2- <#${cfg.servers.dh.channels.rolepick}> kanalından bölüm ve sınıf seçmeniz\n` +
            `gerekmekte.`
        );
    }
  },
  onMemberLeave(member) {
    if (!this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id) || !this.state)
      return;

    const serverKey = this.guilds.find(
      (srv) => cfg.servers[srv as keyof typeof cfg.servers].id === member.guild.id
    ) as keyof typeof vedbot.guilds;
    if (!serverKey) return;

    vedbot.guilds[serverKey].channels
      .get("log")
      ?.send(`:x: -> Left the server: **${member.displayName}**#${member.user.discriminator}`);
  },
} as BotModule;
