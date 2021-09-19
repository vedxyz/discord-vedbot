import { MessageEmbed } from "discord.js";
import { BotModule, cfg, vedbot } from "../vedbot";

export default {
  name: "guildjoinleave",
  description: "Notifies, in a predefined log channel, of members leaving/joining.",
  state: true,
  guilds: ["cs", "dh"],
  onMemberJoin(member) {
    const serverKey = this.guilds.find((srv) => cfg.servers[srv].id === member.guild.id) as keyof typeof vedbot.guilds;

    vedbot.guilds[serverKey].channels.get("log")?.send({
      embeds: [
        new MessageEmbed()
          .setTitle(":o: - Joined the server:")
          .setDescription(`<@${member.id}>`)
          .setColor("GREEN")
          .setTimestamp(),
      ],
    });

    if (member.guild.id === cfg.servers.dh.id) {
      vedbot.guilds.dh.channels.get("newbie")?.send({
        content: `<@${member.id}>`,
        embeds: [
          new MessageEmbed()
            .setTitle(`Merhaba, ${member.displayName} :)`)
            .setDescription("Sunucunun tamamına erişmek için lütfen;")
            .addFields([
              {
                name: "#1",
                value: `<#${cfg.servers.dh.channels.rules}>'ı onaylayınız`,
              },
              {
                name: "#2",
                value: `<#${cfg.servers.dh.channels.rolepick}> kanalından bölüm ve sınıf seçiniz`,
              },
            ])
            .setTimestamp()
            .setFooter(`Teşekkürler.`)
            .setColor("RANDOM")
            .setThumbnail(member.guild.iconURL() || ""),
        ],
      });
    }
  },
  onMemberLeave(member) {
    const serverKey = this.guilds.find((srv) => cfg.servers[srv].id === member.guild.id) as keyof typeof vedbot.guilds;

    vedbot.guilds[serverKey].channels.get("log")?.send({
      embeds: [
        new MessageEmbed()
          .setTitle(":x: - Left the server:")
          .setDescription(`<@${member.id}>`)
          .setColor("RED")
          .setTimestamp(),
      ],
    });
  },
} as BotModule;
