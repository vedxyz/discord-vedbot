import { MessageEmbed } from "discord.js";
import cfg from "../config.json";
import { BotModule } from "../vedbot";

const mizyaz = "644968168040955904";

export default {
  name: "mizyaz",
  description: "",
  state: true,
  guilds: ["dh"],
  onMsg(message) {
    if (
      message.channel.type === "dm" ||
      !this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === message.guild?.id) ||
      message.member === null ||
      !this.state
    )
      return;

    // Mizyaz module
    const mizyazFlag = message.content.match(/[i|İ]slo+[ş|s]\S*/i);

    if (
      mizyazFlag !== null &&
      mizyazFlag.length > 0 &&
      !message.content.endsWith(".") &&
      message.author.id !== mizyaz
    ) {
      message.delete();

      const mizyazEmbed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} says`, message.author.avatarURL() || undefined)
        .setDescription(message.content)
        .setTimestamp()
        .setColor(message.member.displayHexColor);

      message.channel.send(`<@${mizyaz}>`, [mizyazEmbed, ...message.attachments.values()]);

      // eslint-disable-next-line consistent-return
      return false;
    }
  },
} as BotModule;
