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
    interaction.reply({ files: ["https://static.tumblr.com/58d9c77e9619492c680de2a9772bcb51/txjgy5i/2HNoujzqj/tumblr_static_tumblr_static__focused_v3.gif"] });
  },
};

export default command;
