import utils from "../utils";
import { BotCommand, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "test",
    description: "test the bot.",
    defaultPermission: false,
  },
  permissions: [utils.permissions.getOwner(cfg)],
  guilds: ["dh"],
  execute(interaction) {
    interaction.reply({ content: "https://tenor.com/view/thomas-shelby-peaky-blinders-gif-19044952" });
  },
};

export default command;
