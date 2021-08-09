import fetch from "node-fetch";
import utils from "../utils";
import { BotCommand, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "atpic",
    description: "Set or remove an @ picture for yourself.",
    defaultPermission: true,
    options: [
      {
        name: "set",
        description: "Set an @ picture for yourself.",
        type: "SUB_COMMAND",
        options: [
          {
            name: "url",
            description: "The URL to the @ picture you want",
            type: "STRING",
            required: true,
          },
        ],
      },
      {
        name: "remove",
        description: "Remove the current @ picture for yourself.",
        type: "SUB_COMMAND",
      },
    ],
  },
  guilds: ["cr"],
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand === "set") {
      const url = interaction.options.getString("url") ?? "";

      if (!(await fetch(url)).headers.get("content-type")?.startsWith("image/")) {
        interaction.reply({
          ephemeral: true,
          content: "Your @ picture URL doesn't appear to be a valid image.",
        });
        return;
      }

      cfg.servers.cr.at_pics[interaction.user.id] = url;
      utils.config.save(cfg);
      interaction.reply({
        ephemeral: true,
        content: "Your @ picture has been set:",
        files: cfg.servers.cr.at_pics[interaction.user.id],
      });
    } else if (subcommand === "remove") {
      delete cfg.servers.cr.at_pics[interaction.user.id];
      utils.config.save(cfg);
      interaction.reply({ ephemeral: true, content: "Your @ picture has been removed." });
    }
  },
};

export default command;
