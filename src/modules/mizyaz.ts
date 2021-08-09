import { MessageEmbed, MessageOptions } from "discord.js";
import { BotModule } from "../vedbot";

const mizyaz = "644968168040955904";

export default {
  name: "mizyaz",
  description: "",
  state: true,
  guilds: ["dh"],
  onMessage(message) {
    if (message.member === null) return;

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

      const messageOptions: MessageOptions = {
        content: `<@${mizyaz}>`,
        embeds: [mizyazEmbed],
        files: [...message.attachments.values()],
      };

      if (message.reference?.messageId)
        messageOptions.reply = { messageReference: message.reference?.messageId, failIfNotExists: false };

      message.channel.send(messageOptions);
    }
  },
} as BotModule;
