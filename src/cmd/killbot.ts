import { exec } from "child_process";
import path from "path";
import utils from "../utils";
import { BotCommand, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "killbot",
    description: "Kills the bot.",
    defaultPermission: false,
  },
  permissions: [utils.permissions.getOwner(cfg)],
  guilds: ["dh", "cs", "cr"],
  execute(interaction) {
    interaction
      .reply("```=> Killing the bot.```")
      .then(() => exec(`pm2 stop ${path.join(__dirname, "..", "..", "ecosystem.config.js")}`));
  },
};

export default command;
