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
    interaction.reply({ files: ["https://media.tenor.co/videos/09c31ea48352ac890d1b69bd6126c002/mp4"] });
  },
};

export default command;
