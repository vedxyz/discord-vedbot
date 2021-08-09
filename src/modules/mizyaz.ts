import { MessageEmbed, MessageOptions } from "discord.js";
import { BotModule } from "../vedbot";

const mizyazId = "644968168040955904";

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
      message.author.id !== mizyazId
    ) {
      message.delete();

      const mizyazEmbed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} says`, message.author.avatarURL() || undefined)
        .setDescription(message.content)
        .setTimestamp()
        .setColor(message.member.displayHexColor);

      const messageOptions: MessageOptions = {
        content: `<@${mizyazId}>`,
        embeds: [mizyazEmbed, ...message.embeds],
        files: [...message.attachments.values()],
      };

      if (message.mentions.members)
        messageOptions.content += `, ${message.mentions.members
          .filter((member) => member.id !== mizyazId)
          .map((member) => `<@${member.id}>`)
          .join(", ")}`;

      if (message.reference?.messageId) {
        messageOptions.reply = { messageReference: message.reference.messageId, failIfNotExists: false };

        messageOptions.allowedMentions = { repliedUser: message.mentions.has(message.mentions.repliedUser ?? "") };
      }

      message.channel.send(messageOptions);
    }
  },
} as BotModule;
