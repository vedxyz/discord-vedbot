import { BotCommand } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "help",
    description: "",
    defaultPermission: true,
  },
  guilds: ["dh", "cs", "cr"],
  execute(interaction) {
    interaction.reply("This command still has not been implemented...");
  },
};

export default command;
