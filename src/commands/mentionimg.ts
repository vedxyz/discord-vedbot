import fetch from "node-fetch";
import { BotCommand } from "../utils/interface";
import { mentionImages } from "../database/database";

const command: BotCommand = {
  data: {
    name: "mentionimg",
    description: "Set or remove a mention image for yourself.",
    defaultPermission: true,
    options: [
      {
        name: "set",
        description: "Set a mention image for yourself.",
        type: "SUB_COMMAND",
        options: [
          {
            name: "url",
            description: "The URL to the mention image you want",
            type: "STRING",
            required: true,
          },
        ],
      },
      {
        name: "remove",
        description: "Remove the current mention image for yourself.",
        type: "SUB_COMMAND",
      },
    ],
  },
  guilds: ["cr"],
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand === "set") {
      const url = interaction.options.getString("url") ?? "";

      let isUrlValidImg: boolean | undefined;
      try {
        isUrlValidImg = (await fetch(url)).headers.get("content-type")?.startsWith("image/");
      } catch (error) {
        isUrlValidImg = false;
      }

      if (!isUrlValidImg) {
        await interaction.reply({
          ephemeral: true,
          content: "Your mention image URL doesn't appear to be a valid image.",
        });
        return;
      }

      await mentionImages.set(interaction.guildId, interaction.user.id, url);

      await interaction.reply({
        ephemeral: true,
        content: "Your mention image has been set.",
      });
    } else if (subcommand === "remove") {
      await mentionImages.delete(interaction.guildId, interaction.user.id);

      await interaction.reply({ ephemeral: true, content: "Your mention image has been removed." });
    }
  },
};

export default command;
