import { BotCommand } from "../vedbot";

export default {
  name: "help",
  aliases: ["h"],
  description: "",
  args: false,
  usage: "",
  guilds: ["dh"],
  permissions: ["ADMINISTRATOR"],
  // eslint-disable-next-line no-unused-vars
  execute(message, args) {
    // TODO
  },
} as BotCommand;
