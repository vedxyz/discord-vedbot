import { MessageEmbed } from "discord.js";
import { BotModule } from "../utils/interface";

export default {
  name: "dhlink",
  description: "Convert mobile/desktop DonanimHaber links to their counterparts.",
  state: true,
  guilds: ["dh", "cs"],
  onMessage(message) {
    const msg = message.content.toLowerCase().split(/\s/);

    const DHLinks: string[] = [];

    msg
      .filter((e) => e.startsWith("http"))
      .forEach((e) => {
        const DHConvertedUrl = e.replace(
          /^https?:\/\/(mobile|forum)\.donanimhaber.com\//i,
          (match, p1) => `https://${p1.toLowerCase() === "mobile" ? "forum" : "mobile"}.donanimhaber.com/`
        );

        if (DHConvertedUrl !== e) DHLinks.push(DHConvertedUrl);
      });

    if (DHLinks.length) {
      const linksEmbed = new MessageEmbed()
        .setTitle("Alternate DH Links")
        .setColor("#F1672D")
        .setThumbnail("https://forum.donanimhaber.com/static/forum/img/dh-forum-logo.png")
        .setTimestamp()
        .setAuthor({ name: message.member?.displayName ?? "Member", iconURL: message.author.avatarURL() ?? undefined })
        .addFields(DHLinks.map((link, i) => ({ name: `Link #${i + 1}`, value: link, inline: false })));

      message.reply({ embeds: [linksEmbed] });
    }
  },
} as BotModule;
