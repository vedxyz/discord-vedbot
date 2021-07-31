import { BotCommand } from "../vedbot";

export default {
  name: "killbot",
  aliases: ["botkill", "stopbot"],
  description: "Kills the bot.",
  args: false,
  usage: "",
  guilds: [],
  permissions: [],
  allowedUser: ["123867745191198720"],
  execute(message) {
    message.channel.send("```=> Killing the bot.```").then(() => process.exit());
  },
} as BotCommand;
