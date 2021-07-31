import { BotCommand } from "../vedbot";

export default {
  name: "help",
  aliases: ["h"],
  description: "",
  args: false,
  usage: "",
  guilds: ["dh", "cs", "cr"],
  permissions: ["ADMINISTRATOR"],
  execute(message) {
    message.reply("This command still has not been implemented...");
  },
} as BotCommand;
