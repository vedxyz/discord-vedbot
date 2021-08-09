import { BotCommand, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "killbot",
    description: "Kills the bot.",
    defaultPermission: false,
  },
  permissions: [
    {
      id: cfg.ownerId,
      type: "USER",
      permission: true,
    },
  ],
  guilds: ["dh", "cs", "cr"],
  execute(interaction) {
    interaction.reply("```=> Killing the bot.```").then(() => process.exit());
  },
};

export default command;
