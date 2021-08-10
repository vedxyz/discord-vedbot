import { BotModule, cfg } from "../vedbot";

export default {
  name: "atpics",
  description: "Replies with a self selected picture when a person is mentioned.",
  state: true,
  guilds: ["cr"],
  onMessage(message) {
    const atPics: string[] = [];

    message.mentions.users.each((user) => {
      if (Object.prototype.hasOwnProperty.call(cfg.servers.cr.at_pics, user.id) && atPics.length < 10) {
        atPics.push(cfg.servers.cr.at_pics[user.id]);
      }
    });

    if (atPics.length !== 0) message.reply({ files: atPics });
  },
} as BotModule;
