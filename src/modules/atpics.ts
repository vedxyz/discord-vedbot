import { BotModule, cfg } from "../vedbot";

export default {
  name: "atpics",
  description: "",
  state: true,
  guilds: ["cr"],
  onMsg(message) {
    if (
      message.channel.type === "dm" ||
      !this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === message.guild?.id) ||
      !this.state
    )
      return;

    const atPics: string[] = [];

    message.mentions.users.each((user) => {
      if (Object.prototype.hasOwnProperty.call(cfg.servers.cr.at_pics, user.id) && atPics.length < 10) {
        // eslint-disable-next-line camelcase
        atPics.push(cfg.servers.cr.at_pics[user.id as keyof typeof cfg.servers.cr.at_pics]);
      }
    });

    if (atPics.length !== 0) {
      message.reply({ files: atPics });

      // eslint-disable-next-line consistent-return
      return false;
    }
  },
} as BotModule;
