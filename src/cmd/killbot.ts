import utils from "../utils";
import { BotCommand, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "killbot",
    description: "Kills the bot.",
    defaultPermission: false,
  },
  permissions: [
    utils.permissions.getOwner(cfg),
  ],
  guilds: ["dh", "cs", "cr"],
  execute(interaction) {
    interaction.reply("```=> Killing the bot.```").then(() => process.exit());
  },
};

export default command;
