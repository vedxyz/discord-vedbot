import { BotModule } from "../utils/interface";
import { mentionImages } from "../database/database";

export default {
  name: "mentionimg",
  description: "Replies with a self selected image when a person is mentioned.",
  state: true,
  guilds: ["cr"],
  onMessage(message) {
    const matchedImages: string[] = [];

    message.mentions.users.each(async (user) => {
      if (await mentionImages.has(message.guild.id, user.id) && matchedImages.length < 10) {
        matchedImages.push(await mentionImages.get(message.guild.id, user.id));
      }
    });

    if (matchedImages.length !== 0) message.reply({ files: matchedImages });
  },
} as BotModule;
