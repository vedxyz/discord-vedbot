import { MessageEmbed, MessageOptions } from "discord.js";
import { cfg } from "../settings";
import { BotModule } from "../utils/interface";

const mizyazId = cfg.servers.dh.mizyaz.id;
const mizyazRegExp = new RegExp(cfg.servers.dh.mizyaz.regexp, "i");

export default {
  name: "mizyaz",
  description: "Tags a certain friend when a message is implicitly directed to that friend.",
  state: true,
  guilds: ["dh"],
  async onMessage(message) {
    if (message.member === null) return;

    const mizyazFlag = message.content.match(mizyazRegExp);

    if (
      mizyazFlag !== null &&
      mizyazFlag.length > 0 &&
      !message.content.endsWith(".") &&
      message.author.id !== mizyazId
    ) {
      await message.delete();

      const mizyazEmbed = new MessageEmbed()
        .setAuthor({ name: `${message.member.displayName} says`, iconURL: message.author.avatarURL() || undefined })
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

      await message.channel.send(messageOptions);
    }
  },
} as BotModule;
