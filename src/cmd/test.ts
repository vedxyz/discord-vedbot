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
    interaction.reply({ files: ["https://c.tenor.com/2VLFsrPYr8AAAAPo/peaky-blinders.mp4"] });
  },
};

export default command;
